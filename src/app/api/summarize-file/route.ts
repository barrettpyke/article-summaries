import { geminiModel } from '@/server/services/geminiModel';
import { OutputRow } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const rows = await request.json();
    const responseData: OutputRow[] = []

    for (const row of rows) {
      const {article} = row
      const prompt = 'Explain how AI works';

      const result = await geminiModel.generateContent(prompt);
      console.log(result.response.text());
    }

    return NextResponse.json(, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
