// /src/utils/chatBot.ts
import Fuse from 'fuse.js';
import { faqs } from '@/data/faqs';
import type { GeminiMessage } from '@/types/ai';
import { useAI } from '@/composables/useAI';

// Function to initialize chatbot utilities with dependencies
export const useChatBot = (chatStore: ReturnType<typeof import('@/stores/chat')['useChatStore']>) => {
  const { useGemini } = useAI(); // Access Gemini API

  // Initialize Fuse once with faqs
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
    const sentences = text.split(/(?<=[.!?])\s+/);
    return sentences.length > 1 ? sentences : text.match(/.{1,20}(\s|$)/g) || [text];
  };

  // Generate quick reply options based on chat history, ensuring relevance, diversity, and excluding prior questions
  const generateQuickReplies = async (history: GeminiMessage[], currentQuestion: string): Promise<string[]> => {
    let suggestions: string[] = []; // Changed from const to let for mutability

    // Get all user questions (typed or clicked) from chat history, ensuring uniqueness and proper formatting
    const userInteractions = history
      .filter(msg => msg.role === 'user' && msg.content.trim())
      .map(msg => msg.content.trim().toLowerCase().replace(/[.!?]+$/g, '').trim()); // Remove trailing punctuation, normalize, and trim whitespace
    console.log('User Interactions (Previous Questions):', userInteractions); // Debug previous questions
    const previousQuestions = [...new Set(userInteractions)]; // Unique lowercase questions, cleaned of punctuation and whitespace

    const currentQuestionLower = currentQuestion.trim().toLowerCase().replace(/[.!?]+$/g, '').trim(); // Normalize current question
    console.log('Current Question:', currentQuestionLower); // Debug current question

    // Process the current user question (most recent) for suggestions
    const fuseMatches = fuse.search(currentQuestionLower);
    const userKeywords = currentQuestionLower.split(/\s+/).filter(word => word.length > 1); // Relaxed to catch more keywords

    if (fuseMatches.length > 0) {
      // Collect potential suggestions with scores for sorting
      const potentialSuggestions: { question: string; score: number }[] = [];
      
      faqs.forEach(faq => {
        const faqQuestionLower = faq.question.toLowerCase().replace(/[.!?]+$/g, '').trim(); // Normalize FAQ question
        const faqKeywords = faq.keywords || [];

        // Skip if this is the exact current question or was previously asked/clicked
        if (faqQuestionLower === currentQuestionLower || previousQuestions.includes(faqQuestionLower)) return;

        // Check if the FAQ shares keywords or significant words with the user's question
        const hasRelatedKeywords = userKeywords.some(keyword => 
          faqQuestionLower.includes(keyword) || faqKeywords.includes(keyword)
        );

        if (hasRelatedKeywords) {
          // Find the Fuse match score for this FAQ (if any), default to 1.0 if no match
          const fuseMatch = fuseMatches.find(match => match.item.question.toLowerCase().replace(/[.!?]+$/g, '').trim() === faqQuestionLower);
          const score = fuseMatch ? (fuseMatch.score ?? 1.0) : 1.0; // Default to 1.0 if undefined
          potentialSuggestions.push({ question: faq.question, score });
        }
      });

      // Sort suggestions by score (lowest score = most relevant) and ensure diversity
      potentialSuggestions.sort((a, b) => {
        // Sort by score first (lower is better), then by question length for diversity
        if (a.score !== b.score) return a.score - b.score;
        return b.question.length - a.question.length; // Longer questions for variety
      });

      // Add up to 3 most relevant and diverse suggestions
      suggestions = potentialSuggestions.slice(0, 3).map(s => s.question);
      
      // If no suggestions found, use Gemini for dynamic suggestions
      if (suggestions.length === 0) {
        const chatHistoryText = userInteractions.join('\n');
        const faqQuestions = faqs.map(faq => faq.question).join('\n');
        const geminiPrompt = `
          You are Jerome Avecilla’s AI chatbot, designed to suggest up to 3 relevant follow-up questions based on the user’s previous questions and Jerome’s FAQ dataset. Suggest questions that are conversational, engaging, and strictly align with the FAQ questions below. Do not suggest questions that the user has already asked or clicked (previous questions: ${previousQuestions.join(', ')}), nor modify the phrasing significantly.

          Previous User Questions:
          ${chatHistoryText || 'No previous questions.'}

          FAQ Questions (only suggest from these, IDs 1–19):
          ${faqQuestions}

          Provide up to 3 suggested questions, separated by newlines, formatted as plain text questions (e.g., "What services do you offer?").
        `;
        console.log('Gemini Prompt:', geminiPrompt); // Debug Gemini prompt

        try {
          const geminiResponse = await useGemini('', geminiPrompt); // Use empty prompt for suggestions
          console.log('Gemini Response for Suggestions:', geminiResponse); // Debug Gemini response
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
      // Fallback: Pick random questions from all FAQs if no Fuse matches, excluding prior questions
      suggestions = faqs
        .filter(faq => !previousQuestions.includes(faq.question.toLowerCase().replace(/[.!?]+$/g, '').trim()))
        .map(faq => faq.question)
        .sort(() => Math.random() - 0.5) // Randomize
        .slice(0, 3); // Limit to 3 random unique suggestions from all FAQs
    }

    console.log('Final Suggestions:', suggestions); // Debug final suggestions
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

    const results = fuse.search(userInput);
    console.log('User Input:', userInput);
    console.log('Fuse Search Results:', results.map(r => ({
      id: r.item.id,
      question: r.item.question,
      score: r.score,
    })));
    const topMatch = results.length > 0 && results[0].score! < 0.75 ? results[0].item : null;

    const faqContext = `
      Prompt for AI Chatbot Isolation (Conversational Mode with History)

      ROLE:
      You are Jerome Avecilla’s professional AI chatbot, designed to assist users with a formal, professional tone while staying strictly within the provided FAQ dataset. Avoid informal greetings like "Hey!", "Hi!", "Hello!", "Yo!", or "there!" at the start of responses. Reflect Jerome’s personality as a web developer and student professionally.

      TASK:
      - Answer user questions using *only* the information in the FAQ dataset.
      - Adapt the response to the user’s tone and context, including acknowledging chat history if asked (e.g., "what is my previous chat?" or repeats of prior questions).
      - Use the FAQ answer that best matches the question, rephrasing it conversationally without changing its factual content, and maintain a professional tone (e.g., "How can I assist you today?" instead of informal greetings).
      - If the top FAQ match (provided below) has a score < 0.75, prioritize its answer unless the user’s question clearly aligns with a different FAQ or chat history.
      - If the user asks about previous chats (e.g., "what was my last question?" or "what did I ask before?"), summarize or repeat the last 1-3 user questions and bot responses from the chat history in a formal manner.
      - If the question is unrelated to Jerome Avecilla, his services, skills, projects, personal details, or chat history, respond with: "I’m Jerome’s chatbot, and I can only chat about him, his services, projects, interests, or our previous conversation. How may I assist you further regarding Jerome?"
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
    const chunks = chunkResponse(geminiResponse);

    for (const chunk of chunks) {
      yield chunk;
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between chunks
    }
  };

  return {
    streamResponse,
    generateQuickReplies, // Export for external use
  };
};