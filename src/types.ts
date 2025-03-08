export type InputRow = {
  article: string;
  authorName: string;
  metadata: string;
};

export type OutputRow = {
  article: string;
  authorName: string;
  metadata: string;
  summary: string;
  tags: { sentiment: Sentiment; theme: string };
};

export type Sentiment = 'positive' | 'neutral' | 'negative';
