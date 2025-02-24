// /src/composables/useAI.ts
import type { GeminiResponse } from '@/types/ai';

export function useAI() {
  const useGemini = async (prompt: string, faqContext: string): Promise<string> => {
    const apiUrl = `${import.meta.env.VITE_GEMINI_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
    
    if (!apiUrl || !import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API URL or key is missing');
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${faqContext}\n\nUser Question: ${prompt}` }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API failed with status: ${response.status}`);
      }

      const data = await response.json() as GeminiResponse;
      let responseText = data.candidates[0]?.content.parts[0].text ?? 'No response';
      console.log('Raw Gemini Response:', responseText); // Debug raw response
      responseText = responseText
        .replace(/^((Hey|Hello)( there)?!?\s*)/i, '') // Remove informal greetings only at the start (case-insensitive)
        .replace(/ID:\s*\d+\s*A:\s*/i, '') // Keep existing ID pattern
        .replace(/\s+/g, ' ') // Normalize whitespace to single spaces
        .trim(); // Remove leading/trailing whitespace
      console.log('Cleaned Gemini Response:', responseText); // Debug cleaned response
      return responseText;
    } catch (error) {
      console.error('Gemini AI error:', error);
      throw error;
    }
  };

  return {
    useGemini,
  };
}