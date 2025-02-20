import type { GrokMessage, GrokResponse, GeminiResponse } from '@/types/ai';

export function useAI() {
  const useGrokAI = async (messages: readonly GrokMessage[]): Promise<string> => {
    const apiUrl = import.meta.env.VITE_GROK_API_URL as string;
    const apiKey = import.meta.env.VITE_GROK_API_KEY as string;

    if (!apiUrl || !apiKey) {
      throw new Error('Grok API URL or key is missing in environment variables');
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages,
          model: 'grok-2-latest',
          stream: false,
          temperature: 0,
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API request failed with status: ${response.status}`);
      }

      const data = await response.json() as GrokResponse;
      return data.choices[0]?.message.content ?? 'No response content';
    } catch (error) {
      console.error('Error fetching Grok AI:', error);
      throw error;
    }
  };

  const useGeminiAI = async (prompt: string): Promise<string> => {
    const apiUrl = `${import.meta.env.VITE_GEMINI_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
    
    if (!apiUrl || !import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API URL or key is missing');
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API failed with status: ${response.status}`);
      }

      const data = await response.json() as GeminiResponse;
      return data.candidates[0]?.content.parts[0].text ?? 'No response';
    } catch (error) {
      console.error('Gemini AI error:', error);
      throw error;
    }
  };

  return {
    grok: useGrokAI,
    gemini: useGeminiAI,
  };
}
