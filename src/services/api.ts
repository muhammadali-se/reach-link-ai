import { FormData, GeminiResponse } from '../types';
import { fetchMockResults } from './mockApi';

const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

// Check if we should use mock data (when no API key is provided)
export const shouldUseMockData = (): boolean => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return (
    !apiKey ||
    apiKey === 'your_gemini_api_key_here' ||
    apiKey.trim() === ''
  );
};

// Note: In a production app, the API key should be handled server-side
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.'
    );
  }
  return apiKey;
};

// Convert escaped newlines like "\\n" to real ones
const unescapeLineBreaks = (s: string): string =>
  s
    .replace(/\\r\\n/g, '\r\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .trim();

const buildPrompt = (data: FormData): string => {
  const toneInstructions = {
    neutral:
      "Keep a balanced, professional tone that's neither too casual nor too formal.",
    viral:
      'Make it engaging, attention-grabbing, and shareable. Use hooks, emojis, and compelling language that drives engagement.',
    professional:
      'Use a smart, authoritative tone that demonstrates expertise and builds credibility.',
    concise:
      'Keep it brief and to the point. Focus on clarity and impact with minimal words.',
  };

  if (data.mode === 'generate') {
    // NOTE: Changed to produce 3 total posts (original + 2 variations)
    return `Create a comprehensive LinkedIn post about: "${data.input}"

Tone: ${toneInstructions[data.tone]}

Then create 2 alternative variations of this post:
- Variation 1: Different hook/opening
- Variation 2: Different structure/flow

IMPORTANT FORMATTING RULES for all versions:
- Each should be a complete LinkedIn post with proper line breaks between paragraphs
- Use double line breaks (\\n\\n) between paragraphs for proper spacing
- Use single line breaks (\\n) for list items or short breaks
- Include valuable insights, lessons learned, or actionable advice
- Make them professional yet conversational
- Keep each post between 100-200 words
- Format like a real LinkedIn post with spacing and structure
- Return as a JSON array of 3 strings (original + 2 variations)

Example format with proper spacing:
["Hook sentence\\n\\nMain paragraph with insights\\n\\nCall to action", "Variation 1 with line breaks", "Variation 2 with line breaks"]`;
  } else {
    // edit/optimize mode already asks for 3 variants — keep as-is
    return `Take this LinkedIn post and create one optimized version, then generate 2 additional variations:

Original post:
"${data.input}"

Tone: ${toneInstructions[data.tone]}

Create:
1. One main optimized version
2. Alternative version with different hook
3. Alternative version with different structure

IMPORTANT FORMATTING RULES:
- Use double line breaks (\\n\\n) between paragraphs for proper spacing
- Use single line breaks (\\n) for list items or short breaks
- Enhance the hook/opening to be more compelling
- Improve overall structure, clarity and flow
- Add more value and actionable insights if needed
- Optimize for LinkedIn engagement
- Keep it professional yet conversational and authentic
- Maintain the original message and key points
- Ensure it's a complete, well-structured post with proper spacing
- Return 3 improved variations as a JSON array of strings

Example format with proper spacing:
["Hook\\n\\nMain content\\n\\nCall to action", "Variation 2 with line breaks", "Variation 3 with line breaks"]`;
  }
};

export const fetchResults = async (data: FormData): Promise<string[]> => {
  // Use mock data if no API key is configured
  if (shouldUseMockData()) {
    console.log('Using mock data - no Gemini API key configured');
    return fetchMockResults(data);
  }

  try {
    const apiKey = getApiKey();

    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: buildPrompt(data),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${
          errorData.error?.message || ''
        }`
      );
    }

    const result: GeminiResponse = await response.json();

    if (
      !result.candidates ||
      !result.candidates[0] ||
      !result.candidates[0].content ||
      !result.candidates[0].content.parts
    ) {
      throw new Error('Invalid API response format');
    }

    const content = result.candidates[0].content.parts[0].text.trim();

    try {
      // Clean content by removing markdown and formatting
      let cleanContent = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      // Try to parse JSON
      const parsedResults = JSON.parse(cleanContent);
      if (!Array.isArray(parsedResults)) {
        throw new Error('API response is not an array');
      }

      // Normalize line breaks and clean text
      const cleanResults = parsedResults
        .filter((item) => typeof item === 'string' && item.trim().length > 0)
        .map((item) => {
          const stripped = item.trim().replace(/^["']|["']$/g, '');
          return unescapeLineBreaks(stripped);
        });

      // Return up to 3 posts in generate mode (quality over quantity)
      return cleanResults.slice(0, data.mode === 'generate' ? 3 : 3);
    } catch (parseError) {
      // Fallback: if JSON parsing fails, extract manually
      console.warn('Failed to parse JSON, using fallback extraction');

      const lines = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .filter((line) => !line.startsWith('```') && !line.startsWith('[') && !line.startsWith(']'))
        .map((line) =>
          line
            .replace(/^[\d\.\-\*\s"']+/, '')
            .replace(/["',]*$/, '')
            .trim()
        )
        .filter((line) => line.length > 10)
        .map(unescapeLineBreaks);

      if (lines.length > 0) {
        // Return up to 3 items
        return lines.slice(0, data.mode === 'generate' ? 3 : 3);
      }

      // Last resort: return as single cleaned string
      const cleanedContent = unescapeLineBreaks(
        content.replace(/```json|```/g, '').replace(/^\[|\]$/g, '').trim()
      );

      return [cleanedContent];
    }
  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('API configuration error. Please check your Gemini API key.');
      } else if (error.message.includes('401')) {
        throw new Error('Invalid Gemini API key. Please check your credentials.');
      } else if (error.message.includes('403')) {
        throw new Error('Gemini API access denied. Please check your API key permissions.');
      } else if (error.message.includes('429')) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
    }

    throw new Error(`Failed to ${data.mode} post. Please try again.`);
  }
};
