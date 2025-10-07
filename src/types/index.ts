export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export type Mode = 'generate' | 'optimize';

export type Tone = 'neutral' | 'viral' | 'professional' | 'concise';

export interface FormData {
  mode: Mode;
  input: string;
  tone: Tone;
}