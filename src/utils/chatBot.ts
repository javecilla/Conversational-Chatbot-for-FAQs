// /src/utils/chatBot.ts
import Fuse from 'fuse.js';
import { faqs } from '@/data/faqs';
import type { GeminiMessage } from '@/types/ai';
import { useAI } from '@/composables/useAI';

export const useChatBot = (chatStore: ReturnType<typeof import('@/stores/chat')['useChatStore']>) => {
  const { useGemini } = useAI(); 

  const fuse = new Fuse(faqs, {
    keys: [
      { name: 'question', weight: 0.6 },
      { name: 'keywords', weight: 0.4 },
    ],
    threshold: 0.4, // Lowered threshold to catch more matches across all FAQs
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2, // Lowered to catch more keywords
    shouldSort: true,
  });

  const chunkResponse = (text: string): string[] => {
    // Split into sentences, ensuring complete words and avoiding fragmentation
    const sentences = text.split(/(?<=[.!?])\s+/).map(sentence => sentence.trim());
    if (sentences.length > 1) return sentences;
    // Fallback to chunking by complete words and sentences
    return text.match(/[^\s.!?]+(?:\s+[^\s.!?]+)*[.!?]?/g) || [text];
  };

  // Generate quick reply options based on chat history, prioritizing patternSuggestions, and excluding prior questions
  const generateQuickReplies = async (history: GeminiMessage[], currentQuestion: string): Promise<string[]> => {
    let suggestions: string[] = []; 

    // Get all user questions (typed or clicked) from chat history, ensuring uniqueness and proper formatting
    const userInteractions = history
      .filter(msg => msg.role === 'user' && msg.content.trim())
      .map(msg => msg.content.trim().toLowerCase().replace(/[.!?]+$/g, '').trim()); // Remove trailing punctuation, normalize, and trim whitespace
    console.log('User Interactions (Previous Questions):', userInteractions); 
    const previousQuestions = [...new Set(userInteractions)]; // Unique lowercase questions, cleaned of punctuation and whitespace

    const currentQuestionLower = currentQuestion.trim().toLowerCase().replace(/[.!?]+$/g, '').trim(); // Normalize current question
    console.log('Current Question:', currentQuestionLower); 

    // Find the FAQ ID for the current question (if any) using Fuse
    const fuseMatch = fuse.search(currentQuestionLower).find(match => match.score! < 0.75);
    const currentFaqId = fuseMatch?.item.id || null;

    // Prioritize patternSuggestions from the matched FAQ
    if (currentFaqId) {
      const currentFaq = faqs.find(faq => faq.id === currentFaqId);
      if (currentFaq?.patternSuggestions) {
        // Get suggested FAQ IDs from patternSuggestions, excluding previously asked questions
        const patternSuggestions = currentFaq.patternSuggestions
          .map(id => faqs.find(faq => faq.id === id))
          .filter(faq => faq && !previousQuestions.includes(faq.question.toLowerCase().replace(/[.!?]+$/g, '').trim()))
          .map(faq => faq!.question); // Use non-null assertion since we filtered for existence

        // Use patternSuggestions if available, limiting to 3 suggestions
        if (patternSuggestions.length > 0) {
          suggestions = patternSuggestions.slice(0, 3);
        }
      }

      // If no pattern suggestions or not enough, fall back to Fuse-based suggestions from related FAQs
      if (suggestions.length === 0) {
        const userKeywords = currentQuestionLower.split(/\s+/).filter(word => word.length > 1); // Relaxed to catch more keywords

        faqs.forEach(faq => {
          const faqQuestionLower = faq.question.toLowerCase().replace(/[.!?]+$/g, '').trim(); // Normalize FAQ question
          const faqKeywords = faq.keywords || [];

          // Skip if this is the exact current question or was previously asked/clicked
          if (faqQuestionLower === currentQuestionLower || previousQuestions.includes(faqQuestionLower)) return;

          // Check if the FAQ shares keywords or significant words with the user's question
          const hasRelatedKeywords = userKeywords.some(keyword => 
            faqQuestionLower.includes(keyword) || faqKeywords.includes(keyword)
          );

          if (hasRelatedKeywords && suggestions.length < 3) {
            suggestions.push(faq.question); // Add related FAQ question
          }
        });
      }

      // If still no suggestions, use Gemini for dynamic suggestions
      if (suggestions.length === 0) {
        const chatHistoryText = userInteractions.join('\n');
        const faqQuestions = faqs.map(faq => faq.question).join('\n');
        const geminiPrompt = `
          You are Jerome Avecilla’s professional AI chatbot, designed to suggest up to 3 relevant follow-up questions based on the user’s previous questions and Jerome’s FAQ dataset. Suggest questions that are conversational, engaging, strictly align with the FAQ questions below, and use clear, professional language without typos, abbreviations, or random characters (e.g., 'gh', 'Ts'). Do not suggest questions that the user has already asked or clicked (previous questions: ${previousQuestions.join(', ')}), nor modify the phrasing significantly.

          Previous User Questions:
          ${chatHistoryText || 'No previous questions.'}

          FAQ Questions (only suggest from these, IDs 1–19):
          ${faqQuestions}

          Provide up to 3 suggested questions, separated by newlines, formatted as plain text questions (e.g., "What services do you offer?").
        `;
        console.log('Gemini Prompt:', geminiPrompt); 

        try {
          const geminiResponse = await useGemini('', geminiPrompt); // Use empty prompt for suggestions
          console.log('Gemini Response for Suggestions:', geminiResponse); 
          const geminiSuggestions = geminiResponse
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && faqs.some(faq => faq.question === line) && !previousQuestions.includes(line.toLowerCase().replace(/[.!?]+$/g, '').trim())) // Normalize and exclude prior questions
            .slice(0, 3); // Limit to 3 suggestions
          suggestions.push(...geminiSuggestions);
        } catch (error) {
          console.error('Error generating Gemini suggestions:', error);
          // Fallback to default suggestions from all FAQs, excluding prior questions
          suggestions = faqs
            .filter(faq => !previousQuestions.includes(faq.question.toLowerCase().replace(/[.!?]+$/g, '').trim()))
            .map(faq => faq.question)
            .slice(0, 3); // Limit to 3 unique suggestions from all FAQs
        }
      }
    } else {
      // If no FAQ match, use Gemini for dynamic suggestions as the primary fallback
      const chatHistoryText = userInteractions.join('\n');
      const faqQuestions = faqs.map(faq => faq.question).join('\n');
      const geminiPrompt = `
        You are Jerome Avecilla’s professional AI chatbot, designed to suggest up to 3 relevant follow-up questions based on the user’s previous questions and Jerome’s FAQ dataset. Suggest questions that are conversational, engaging, strictly align with the FAQ questions below, and use clear, professional language without typos, abbreviations, or random characters (e.g., 'gh', 'Ts'). Do not suggest questions that the user has already asked or clicked (previous questions: ${previousQuestions.join(', ')}), nor modify the phrasing significantly.

        Previous User Questions:
        ${chatHistoryText || 'No previous questions.'}

        FAQ Questions (only suggest from these, IDs 1–19):
        ${faqQuestions}

        Provide up to 3 suggested questions, separated by newlines, formatted as plain text questions (e.g., "What services do you offer?").
      `;

      try {
        const geminiResponse = await useGemini('', geminiPrompt); // Use empty prompt for suggestions
        console.log('Gemini Response for Suggestions:', geminiResponse); 
        const geminiSuggestions = geminiResponse
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && faqs.some(faq => faq.question === line) && !previousQuestions.includes(line.toLowerCase().replace(/[.!?]+$/g, '').trim())) // Normalize and exclude prior questions
          .slice(0, 3); // Limit to 3 suggestions
        suggestions.push(...geminiSuggestions);
      } catch (error) {
        console.error('Error generating Gemini suggestions:', error);
        // Fallback to default suggestions from all FAQs, excluding prior questions
        suggestions = faqs
          .filter(faq => !previousQuestions.includes(faq.question.toLowerCase().replace(/[.!?]+$/g, '').trim()))
          .map(faq => faq.question)
          .sort(() => Math.random() - 0.5) // Randomize
          .slice(0, 3); // Limit to 3 random unique suggestions from all FAQs
      }
    }

    console.log('Final Suggestions:', suggestions);
    return [...new Set(suggestions)].slice(0, 3); // Unique, up to 3 suggestions
  };

  const streamResponse = async function* (prompt: string, isStarter: boolean = false) {
    if (isStarter) {
      // Handle starter message directly without Fuse or Gemini processing
      const starterText = 'Hello, I am Javecilla ChatBot. How can I assist you?';
      const chunks = chunkResponse(starterText);
      for (const chunk of chunks) {
        yield chunk;
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between chunks
      }
      return; // Exit early for starter message
    }

    const userInput = prompt.trim().toLowerCase();

    // Get chat history from the provided chatStore
    const chatHistory = chatStore.messages.slice(-5).map((msg: GeminiMessage) => 
      `${msg.role === 'user' ? 'User' : 'Chatbot'}: ${msg.content}`
    ).join('\n');

    // Check if the input is a question (e.g., contains "how," "what," "why," or ends with "?")
    const isQuestion = /(?:^|\s)(how|what|why|when|where|who)\b/i.test(userInput) || userInput.endsWith('?');
    console.log('Is Question:', isQuestion, 'User Input:', userInput);

    let responseText = '';

    if (isQuestion || userInput.trim()) {
      // Process questions or non-empty inputs through FAQs
      const results = fuse.search(userInput);
      console.log('Fuse Search Results:', results.map(r => ({
        id: r.item.id,
        question: r.item.question,
        score: r.score,
      })));
      const topMatch = results.length > 0 && results[0].score! < 0.75 ? results[0].item : null;

      const faqContext = `
        Prompt for AI Chatbot Isolation (Conversational Mode with History)

        ROLE:
        You are Jerome Avecilla’s professional AI chatbot, designed to assist users with a formal, professional tone while staying strictly within the provided FAQ dataset. Avoid informal greetings like "Hey!", "Hi!", "Hello!", "Yo!", or "there!" at the start of responses. Reflect Jerome’s personality as a web developer and student professionally, responding as if you are Jerome (using "me," "I," or "my" instead of referring to Jerome in the third person, e.g., "You can connect with me via LinkedIn" instead of "You can connect with Jerome via LinkedIn"). Ensure responses are clear, accurate, engaging, and free of typos, abbreviations, random characters (e.g., 'gh', 'Ts'), or incomplete words. Use full, correct words like 'high' or 'This' instead of fragments. For inputs that are not questions or FAQ-related (e.g., compliments, casual remarks like 'that’s nice,' 'well done,' 'you’re awesome'), generate a natural, professional acknowledgment or response (e.g., "Thank you, I appreciate your kind words! It’s great to hear you feel that way about me...") without jumping to FAQ answers, ensuring relevance and engagement while maintaining professionalism.

        TASK:
        - If the user’s input is a question (e.g., contains 'how,' 'what,' 'why,' 'when,' 'where,' or 'who,' or ends with '?'), answer using *only* the information in the FAQ dataset, ensuring no random or incomplete words appear, and always respond in the first person as Jerome (e.g., "I’m Jerome Avecilla," "You can connect with me," "My skills include").
        - If the user’s input is not a question and doesn’t match any FAQ (e.g., compliments like 'that’s nice,' 'you’re good,' 'well done,' or casual remarks), use Gemini to generate a natural, professional acknowledgment or response (e.g., "Thank you, I appreciate your kind words! It’s great to hear you feel that way about me..."). Do not assume it’s a FAQ question or prepend FAQ answers; instead, craft a standalone, relevant response that enhances engagement while remaining formal.
        - Adapt the response to the user’s tone and context, including acknowledging chat history if asked (e.g., "what is my previous chat?" or repeats of prior questions).
        - Use the FAQ answer that best matches the question, rephrasing it conversationally without changing its factual content, and maintain a professional tone (e.g., "How can I assist you today?" instead of informal greetings). Ensure responses consistently use "me," "I," or "my" to refer to Jerome, even if the user mentions "him" or "Jerome" (e.g., for "how can I contact him," respond "You can connect with me via LinkedIn...").
        - If the top FAQ match (provided below) has a score < 0.75, prioritize its answer unless the user’s question clearly aligns with a different FAQ or chat history.
        - If the user asks about previous chats (e.g., "what was my last question?" or "what did I ask before?"), summarize or repeat the last 1-3 user questions and bot responses from the chat history in a formal manner, using "me" or "I" to refer to Jerome.
        - If the question is unrelated to Jerome Avecilla, his services, skills, projects, personal details, or chat history, respond with: "I’m Jerome’s chatbot, and I can only chat about me, my services, projects, interests, or our previous conversation. How may I assist you further regarding me?"
        - Return *only the answer text*, no "ID: X A:" prefixes.

        FAQ Dataset:
        ${faqs.map(faq => `ID: ${faq.id}\nQ: ${faq.question}\nA: ${faq.answer}\nKeywords: ${faq.keywords?.join(', ') || ''}`).join('\n\n')}

        Chat History (last 5 messages, most recent first):
        ${chatHistory || 'No previous chats.'}

        Top FAQ Match (if any):
        ${topMatch ? `ID: ${topMatch.id}\nQ: ${topMatch.question}\nA: ${topMatch.answer}` : 'None'}
      `;

      const geminiResponse = await useGemini(userInput, faqContext);
      console.log('Gemini Response:', geminiResponse);

      responseText = geminiResponse.trim();
    } else if (!userInput.trim()) {
      // Handle empty input with a prompt
      responseText = 'How may I assist you today?';
    }

    const chunks = chunkResponse(responseText);

    for (const chunk of chunks) {
      yield chunk;
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between chunks
    }
  };

  return {
    streamResponse,
    generateQuickReplies, 
  };
};