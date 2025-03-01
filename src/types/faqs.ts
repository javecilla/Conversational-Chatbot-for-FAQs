// /src/types/faqs.ts
export interface FAQ {
    readonly id: number | string;
    readonly question: string;
    readonly answer: string;
    readonly keywords: string[];
    readonly patternSuggestions?: number[];
    readonly category?: string;
    readonly formatSuggestion?: string[]; // New field for suggested format (e.g., ["bullet", "list"], ["paragraph", "sentence"])
}