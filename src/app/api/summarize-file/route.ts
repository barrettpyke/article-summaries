import { geminiModel } from '@/server/services/geminiModel';
import { OutputRow } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const rows = await request.json();
    const responseData: OutputRow[] = [];

    for (const row of rows) {
      const { article } = row;
      const prompt = `You are a data processor, using the article starting after BEGIN and up to END craft a summary that is detailed and thorough, while maintaining clarity and conciseness. Rely strictly on the provided text, without including external information. Format the summary in one or two sentences for easy understanding. Using the same article determine the sentiment of the text which can be positive, neutral, or negative. Also using the same article determine the theme, for example if the article discusses a specific industry use that, if the article is about a specific sport use that. The response should be a JSON object with the summary, sentiment, and theme.
      
      BEGIN
      ${article}
      END`;

      const result = await geminiModel.generateContent(prompt);
      const obj = result.response.text();
      console.log(obj);
      responseData.push(JSON.parse(obj));
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
