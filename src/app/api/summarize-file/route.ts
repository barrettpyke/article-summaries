/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildResponse } from '@/helpers/buildResponse';
import { parseJson } from '@/helpers/parseJson';
import { geminiModel } from '@/server/services/geminiModel';
import { NextRequest, NextResponse } from 'next/server';

export type SummarizeFileResponse = {
  article: string;
  authorName: string;
  metadata: string;
  summary: string;
  tags: string;
};

export async function POST(request: NextRequest) {
  try {
    const rows = await request.json();
    const responseData: SummarizeFileResponse[] = [];

    for (const row of rows) {
      const { article } = row;
      const prompt = `
      Please analyze the following article and return a JSON object with the following keys:

      * **summary**: A concise summary of the article's main points (maximum 3 sentences).
      * **sentiment**: An object containing the overall sentiment of the article, categorized as "positive", "negative", or "neutral", and a confidence score between 0 and 1 representing the certainty of the sentiment analysis.
      * **theme**: A brief description of the article's primary subject matter or theme (e.g., "technology", "politics", "sports", "finance", "health", "entertainment").

      Here is the article:

      ${article}

      Please return your response in the following JSON format:

      {
        "summary": "[Your summary here]",
        "sentiment": "[positive/negative/neutral]",
        "theme": "[Article theme here]"
      }
`;

      const result = await geminiModel.generateContent(prompt);
      const text = result.response.text();
      const obj = parseJson(text);
      const responseRow = buildResponse(obj, row);

      responseData.push(responseRow);
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.statusText }, { status: error.status });
  }
}
