// src/utils/geminiAi.ts
interface GeminiContent {
    parts: readonly { text: string }[];
  }
  
  interface GeminiResponse {
    candidates: readonly {
      content: { parts: readonly { text: string }[]; role: string };
      finishReason: string;
    }[];
  }
  
  async function fetchGeminiAI(prompt: string): Promise<string> {
    const apiUrl = `${import.meta.env.VITE_GEMINI_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`;
    
    if (!apiUrl || !import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API URL or key is missing');
    }
  
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
  }
  
  export const useGeminiAI = () => ({
    fetch: fetchGeminiAI,
  });