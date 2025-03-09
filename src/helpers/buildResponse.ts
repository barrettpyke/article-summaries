import { SummarizeFileResponse } from '@/app/api/summarize-file/route';
import { InputRow, Sentiment } from '@/types';

type GeminiResponse = {
  summary: string;
  sentiment: GeminiSentiment;
  theme: string;
};

type GeminiSentiment = { overall: Sentiment; confidence: number };

export const buildResponse = (
  json: GeminiResponse,
  originalRow: InputRow,
): SummarizeFileResponse => {
  const { summary, sentiment, theme } = json;

  return {
    ...originalRow,
    summary,
    tags: JSON.stringify({ sentiment: getFinalSentiment(sentiment), theme }),
  };
};

const getFinalSentiment = (originalSentiment: GeminiSentiment): Sentiment => {
  const { overall, confidence } = originalSentiment;
  if (confidence >= 0.7) {
    return overall;
  }

  return 'unknown';
};
