export interface FAQ {
    readonly id: number;
    readonly question: string;
    readonly answer: string;
    readonly keywords: string[];
    readonly patternSuggestions?: number[];
}