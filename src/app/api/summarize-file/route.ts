import { parseJson } from '@/helpers/parseJson';
import { geminiModel } from '@/server/services/geminiModel';
import { OutputRow } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const rows = await request.json();
    const responseData: OutputRow[] = [];

    for (const row of rows) {
      const { article } = row;
      const prompt = `
      Please analyze the following article and return a JSON object with the following keys:

      * **summary**: A concise summary of the article's main points (maximum 3 sentences).
      * **sentiment**: The overall sentiment of the article, categorized as "positive", "negative", or "neutral".
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
      responseData.push({ ...row, ...obj });
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
