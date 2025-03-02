// /src/utils/chatBot.ts
import Fuse from 'fuse.js';
import { faqs } from '@/data/faqs';
import type { GeminiMessage } from '@/types/ai';
import type { FAQ } from '@/types/faqs'; // Corrected import
import { useAI } from '@/composables/useAI';
import { ref } from 'vue';

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

  // Generate quick reply options based on chat history, prioritizing category-based suggestions, and excluding prior questions
  const generateQuickReplies = async (history: GeminiMessage[], currentQuestion: string): Promise<string[]> => {
    let suggestions: string[] = []; 

    // Get all user questions (typed or clicked) from chat history, ensuring uniqueness and proper formatting
    const userInteractions = history
      .filter(msg => msg.role === 'user' && msg.content.trim())
      .map(msg => msg.content.trim().toLowerCase().replace(/[.!?]+$/g, '').trim()); // Remove trailing punctuation, normalize, and trim whitespace
    //console.log('User Interactions (Previous Questions):', userInteractions); 
    const previousQuestions = [...new Set(userInteractions)]; // Unique lowercase questions, cleaned of punctuation and whitespace

    const currentQuestionLower = currentQuestion.trim().toLowerCase().replace(/[.!?]+$/g, '').trim(); // Normalize current question
    //console.log('Current Question:', currentQuestionLower); 

    // Find the FAQ ID for the current question (if any) using Fuse
    const fuseResults = fuse.search(currentQuestionLower);
    let fuseMatch: { item: FAQ; score: number } | undefined;
    for (const match of fuseResults) {
      if (match.score !== undefined && match.score < 0.75) {
        fuseMatch = { item: match.item as FAQ, score: match.score };
        break;
      }
    }
    const currentFaqId = fuseMatch?.item.id || null;

    // Prioritize category-based suggestions from the matched FAQ
    if (currentFaqId) {
      const currentFaq = faqs.find(faq => faq.id === currentFaqId);
      if (currentFaq?.category) {
        // Get all FAQs in the same category, excluding the current question and previously asked questions
        const sameCategoryFaqs = faqs
          .filter(faq => faq.category === currentFaq.category && faq.id !== currentFaqId)
          .filter(faq => !previousQuestions.includes(faq.question.toLowerCase().replace(/[.!?]+$/g, '').trim()))
          .map(faq => faq.question);

        // Use up to 3 suggestions from the same category
        if (sameCategoryFaqs.length > 0) {
          suggestions = sameCategoryFaqs.slice(0, 3);
        }
      }

      // If no category-based suggestions or not enough, fall back to patternSuggestions
      if (suggestions.length === 0 && currentFaq?.patternSuggestions) {
        const patternSuggestions = currentFaq.patternSuggestions
          .map(id => faqs.find(faq => faq.id === id))
          .filter(faq => faq && !previousQuestions.includes(faq.question.toLowerCase().replace(/[.!?]+$/g, '').trim()))
          .map(faq => faq!.question); // Use non-null assertion since we filtered for existence

        if (patternSuggestions.length > 0) {
          suggestions = patternSuggestions.slice(0, 3);
        }
      }

      // If still no suggestions or not enough, fall back to Fuse-based suggestions from related FAQs
      if (suggestions.length === 0) {
        const userKeywords = currentQuestionLower.split(/\s+/).filter(word => word.length > 1); // Relaxed to catch more keywords

        faqs.forEach(faq => {
          const faqQuestionLower = faq.question.toLowerCase().replace(/[.!?]+$/g, '').trim(); // Fixed typo
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
          You are Jerome Avecilla’s professional AI chatbot, designed to suggest up to 3 relevant follow-up questions based on the user’s previous questions and Jerome’s FAQ dataset. Suggest questions that are conversational, engaging, strictly align with the FAQ questions below, and use clear, professional language with Markdown formatting (e.g., **bold**, *italics*) and emojis (e.g., 😊) where appropriate. Do not suggest questions that the user has already asked or clicked (previous questions: ${previousQuestions.join(', ')}), nor modify the phrasing significantly. Prioritize questions from the same category as the current question if applicable.

          Previous User Questions:
          ${chatHistoryText || 'No previous questions.'}

          FAQ Questions (only suggest from these, IDs 1–30):
          ${faqQuestions}

          Provide up to 3 suggested questions, separated by newlines, formatted as plain text questions (e.g., "What services do you offer?").
        `;
        //console.log('Gemini Prompt:', geminiPrompt); 

        try {
          const geminiResponse = await useGemini('', geminiPrompt); // Use empty prompt for suggestions
          //console.log('Gemini Response for Suggestions:', geminiResponse); 
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
        You are Jerome Avecilla’s professional AI chatbot, designed to suggest up to 3 relevant follow-up questions based on the user’s previous questions and Jerome’s FAQ dataset. Suggest questions that are conversational, engaging, strictly align with the FAQ questions below, and use clear, professional language with Markdown formatting (e.g., **bold**, *italics*) and emojis (e.g., 😊) where appropriate. Do not suggest questions that the user has already asked or clicked (previous questions: ${previousQuestions.join(', ')}), nor modify the phrasing significantly. Prioritize questions from common categories (e.g., Services, About Me) if applicable.

        Previous User Questions:
        ${chatHistoryText || 'No previous chats.'}

        FAQ Questions (only suggest from these, IDs 1–30):
        ${faqQuestions}

        Provide up to 3 suggested questions, separated by newlines, formatted as plain text questions (e.g., "What services do you offer?").
      `;

      try {
        const geminiResponse = await useGemini('', geminiPrompt); // Use empty prompt for suggestions
        //console.log('Gemini Response for Suggestions:', geminiResponse); 
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

    //console.log('Final Suggestions:', suggestions);
    return [...new Set(suggestions)].slice(0, 3); // Unique, up to 3 suggestions
  };

  let irrelevantCount = 0;
  const isOffTopic = ref(false); // Add this

  const streamResponse = async function* (prompt: string, isStarter: boolean = false) {
    if (isStarter) {
      const starterText = 'Hello 👋, I am Javecilla Chat bot. How can I assist you? 😊';
      const chunks = chunkResponse(starterText);
      for (const chunk of chunks) {
        yield chunk;
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      irrelevantCount = 0;
      return;
    }
  
    const userInput = prompt.trim().toLowerCase();
    //console.log('User Input Type:', typeof userInput, 'Value:', userInput);
  
    const chatHistory = chatStore.messages.map((msg: GeminiMessage) => 
      `${msg.role === 'user' ? 'User' : 'Chatbot'}: ${msg.content} (at ${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
    ).join('\n');
    //console.log('Full Chat History:', chatHistory);
  
    const isQuestion = /(?:^|\s)(how|what|why|when|where|who)\b/i.test(userInput) || userInput.endsWith('?');
    //console.log('Is Question:', isQuestion, 'User Input:', userInput);
  
    let responseText = '';
  
    if (isQuestion || userInput.trim()) {
      const results = fuse.search(userInput);
      /*console.log('Fuse Search Results:', results.map(r => ({
        id: r.item.id,
        question: r.item.question,
        score: r.score || 1,
      })));*/
      const topMatch = results.length > 0 ? results[0].item : null;

      //console.log('results:', results.map(r => r.score || 1));
      // Off-topic tracking
      if (!topMatch || (results.length > 0 && (results[0].score || 1)  > 0.75)) {
        irrelevantCount++;
        if (irrelevantCount >= 3) {
          isOffTopic.value = true; // Set to true when limit reached
          responseText = "It seems we’re drifting off-topic. Want to start fresh? Click the button on the left to begin a new conversation! 😊";
          const chunks = chunkResponse(responseText);
          for (const chunk of chunks) {
            yield chunk;
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          irrelevantCount = 0; // Reset after suggestion
          return;
        }
      } else {
        irrelevantCount = 0; // Reset if a relevant question is asked
        isOffTopic.value = false; // Reset when back on topic
      }
  
      const hasMatch = topMatch !== null;
      // Detect list request
      const isListRequest = /list|bullet|points/i.test(userInput);
  
      // Add enhanced formatting instruction with formatSuggestion
      let formattingInstruction = `
        Format the response based on the FAQ's formatSuggestion field and the user’s input. 
        - If the FAQ's formatSuggestion includes 'bullet' or the input contains 'list', 'bullet', or 'points', use '- ' followed by a space on a new line for each item, preserving '\\n-' from the FAQ.
        - If the FAQ's formatSuggestion includes 'numbered', use '1. ' followed by a space on a new line for each item, preserving '\\n1.' from the FAQ.
        - If the FAQ's formatSuggestion includes 'paragraph' and no list is requested, format as plain text without altering the structure.
        - **Mandatorily preserve the exact Markdown formatting (e.g., '\\n-', '\\n1., **bold**, *italics*) from the FAQ answer when a match is found**, including all items without omission or rephrasing unless clarity requires minor adjustment.
        - Use separate paragraphs for introductory or trailing text (e.g., 'I've worked on...' or 'Check my portfolio!').
        - Always use **Markdown formatting** (e.g., **bold**, *italics*, '-' for lists, '| header | data |' for tables) and emojis (e.g., 😊, 🚀) to enhance engagement.
      `;
      // Apply formatSuggestion outside isListRequest to ensure all matches are considered
      if (topMatch && topMatch.formatSuggestion) {
        if (topMatch.formatSuggestion.includes('bullet')) {
          formattingInstruction += `
            Prioritize a bullet-point list format based on formatSuggestion, ensuring all items are included.
          `;
        } else if (topMatch.formatSuggestion.includes('numbered')) {
          formattingInstruction += `
            Prioritize a numbered list format based on formatSuggestion, ensuring all items are included.
          `;
        }
      }
      if (isListRequest) {
        formattingInstruction += `
          Prioritize a bullet-point list format when 'list' is mentioned, ensuring all items are included.
        `;
      }
  
      const faqContext = `
        Prompt for AI Chatbot Isolation (Conversational Mode with History)
  
        ROLE:
        You are Jerome Avecilla’s professional AI chatbot, designed to assist users with a formal, professional tone while staying strictly within the provided FAQ dataset when applicable. Avoid informal greetings like "Hey!", "Hi!", "Hello!", "Yo!", or "there!" at the start of responses. Reflect Jerome’s personality as a web developer and student professionally, responding as if you are Jerome (using "me," "I," or "my" instead of referring to Jerome in the third person). Ensure responses are clear, accurate, engaging, and free of typos, abbreviations, or random characters. Enhance readability and engagement by incorporating **Markdown formatting** (e.g., **bold**, *italics*, lists with '-', tables with \`| header | data |\`) and emojis (e.g., 😊, 🚀) where appropriate.
  
        ${formattingInstruction}
  
        TASK:
        - If the user’s input is a question (e.g., contains 'how,' 'what,' 'why,' 'when,' 'where,' or 'who,' or ends with '?') and a FAQ match is found, answer using *only* the information in the FAQ dataset, strictly adhering to the formatSuggestion field (e.g., 'bullet' as \\n-, 'numbered' as \\n1., 'paragraph' as plain text) and preserving its Markdown formatting (e.g., **bold**, *italics*) with emojis as needed.
        - If the user’s input is a question but doesn’t match any FAQ (or asks about previous chats), use the chat history to generate a response. Summarize or quote relevant user messages with timestamps.
        - If the user’s input is not a question and doesn’t match any FAQ, generate a natural acknowledgment with Markdown and emojis.
        - Adapt the response to the user’s tone and context, leveraging the chat history and FAQ categories.
        - Use the FAQ answer that best matches the question, rephrasing it with Markdown and emojis only if necessary to maintain clarity, but always respect the formatSuggestion and original structure.
        - If a top FAQ match is found, prioritize its answer.
        - If unrelated to Jerome or his topics, respond with: "I’m Jerome’s chatbot, and I can only chat about me, my services, projects, interests, or our previous conversation. How may I assist you further regarding me? 😊"
        - Return *only the answer text with Markdown and emojis*, no "ID: X A:" prefixes.
  
        FAQ Dataset:
        ${faqs.map(faq => `ID: ${String(faq.id)}\nQ: ${faq.question}\nA: ${faq.answer}\nKeywords: ${faq.keywords?.join(', ') || ''}\nCategory: ${faq.category || 'Uncategorized'}\nFormatSuggestion: ${faq.formatSuggestion?.join(', ') || 'paragraph, sentence'}`).join('\n\n')}
  
        Chat History (all messages):
        ${chatHistory}
  
        Top FAQ Match (if any):
        ${topMatch ? `ID: ${String(topMatch.id)}\nQ: ${topMatch.question}\nA: ${topMatch.answer}\nCategory: ${topMatch.category || 'Uncategorized'}\nFormatSuggestion: ${topMatch.formatSuggestion?.join(', ') || 'paragraph, sentence'}` : 'None'}
      `;
  
      const geminiResponse = await useGemini(userInput, faqContext);
      //console.log('Gemini Response:', geminiResponse);
  
      // Post-process to enforce formatSuggestion
      responseText = geminiResponse.trim();
      if (topMatch && topMatch.formatSuggestion) {
        if (topMatch.formatSuggestion.includes('bullet') && (topMatch.answer.includes('\n- ') || isListRequest)) {
          responseText = geminiResponse.replace(/\n-/g, '\n- ').replace(/- /g, '\n- ').trim(); // Ensure bullet list
        } else if (topMatch.formatSuggestion.includes('numbered') && topMatch.answer.includes('\n1.')) {
          responseText = geminiResponse.replace(/\n\d+\./g, match => match.trim() + ' ').replace(/\d+\. /g, '\n$&').trim(); // Ensure numbered list
        } else if (topMatch.formatSuggestion.includes('paragraph') && !topMatch.formatSuggestion.includes('bullet') && !topMatch.formatSuggestion.includes('numbered')) {
          responseText = geminiResponse.replace(/(\n-|\n\d+\.)/g, '').trim(); // Force plain text
        }
      } else if (isListRequest && geminiResponse.includes('-')) {
        // Fallback for list request with inline hyphens
        const lines = geminiResponse.split('\n').map(line => line.trim());
        let listItems = lines.filter(line => line.startsWith('- ') || line.startsWith('* '));
        if (listItems.length === 0) {
          const items = geminiResponse.split('-').map(item => item.trim()).filter(item => item && !item.includes('portfolio'));
          if (items.length > 1) {
            const intro = geminiResponse.split('-')[0].trim();
            const outro = geminiResponse.split('portfolio')[1]?.trim() || '';
            listItems = items.slice(1).map(item => `- ${item}`);
            responseText = [intro, listItems.join('\n'), outro ? `You can find more details in my portfolio! ${outro}` : ''].filter(text => text.trim()).join('\n\n');
          }
        } else {
          responseText = geminiResponse.trim();
        }
      }
    } else if (!userInput.trim()) {
      responseText = 'How may I assist you today? 😊';
    }
  
    const chunks = chunkResponse(responseText);
  
    for (const chunk of chunks) {
      yield chunk;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const resetOffTopic = () => {
    irrelevantCount = 0;
    isOffTopic.value = false;
  };

  return {
    streamResponse,
    generateQuickReplies, 
    isOffTopic,
    resetOffTopic, // Export the reset function
  };
};