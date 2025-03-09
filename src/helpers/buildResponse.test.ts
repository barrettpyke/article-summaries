import { InputRow, Sentiment } from '@/types';
import { SummarizeFileResponse } from '@/app/api/summarize-file/route';
import { buildResponse, GeminiResponse } from './buildResponse';

describe('buildResponse', () => {
  it('should correctly build the response with high confidence sentiment', () => {
    const expectedResponse: SummarizeFileResponse = {
      ...TEST_ORIGINAL_ROW,
      summary: 'This is a summary.',
      tags: JSON.stringify({ sentiment: 'positive', theme: TEST_GEMINI_RESPONSE.theme }),
    };

    const result = buildResponse(TEST_GEMINI_RESPONSE, TEST_ORIGINAL_ROW);
    expect(result).toEqual(expectedResponse);
  });

  it('should correctly build the response with low confidence sentiment, resulting in "unknown"', () => {
    const geminiResponse = {
      ...TEST_GEMINI_RESPONSE,
      sentiment: { overall: 'negative' as Sentiment, confidence: 0.6 },
    };

    const expectedResponse: SummarizeFileResponse = {
      ...TEST_ORIGINAL_ROW,
      summary: TEST_GEMINI_RESPONSE.summary,
      tags: JSON.stringify({ sentiment: 'unknown', theme: TEST_GEMINI_RESPONSE.theme }),
    };

    const result = buildResponse(geminiResponse, TEST_ORIGINAL_ROW);
    expect(result).toEqual(expectedResponse);
  });

  it('should handle confidence of 0.7 as overall value', () => {
    const geminiResponse = {
      ...TEST_GEMINI_RESPONSE,
      sentiment: { overall: 'positive' as Sentiment, confidence: 0.7 },
    };

    const expectedResponse: SummarizeFileResponse = {
      ...TEST_ORIGINAL_ROW,
      summary: TEST_GEMINI_RESPONSE.summary,
      tags: JSON.stringify({ sentiment: 'positive', theme: TEST_GEMINI_RESPONSE.theme }),
    };
    const result = buildResponse(geminiResponse, TEST_ORIGINAL_ROW);
    expect(result).toEqual(expectedResponse);
  });
});

const TEST_ORIGINAL_ROW: InputRow = {
  article: 'this is a test article',
  authorName: 'John Smith',
  metadata: '{likes: 22}',
};

const TEST_GEMINI_RESPONSE: GeminiResponse = {
  summary: 'This is a summary.',
  sentiment: { overall: 'positive' as Sentiment, confidence: 0.8 },
  theme: 'technology',
};
