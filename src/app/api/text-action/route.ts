import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, text } = body;

    if (!action || !text) {
      return NextResponse.json(
        { error: 'Both action and text are required' },
        { status: 400 }
      );
    }

    let prompt = '';
    
    switch (action) {
      case 'shorten':
        prompt = `Shorten this text while preserving its meaning: "${text}"`;
        break;
      case 'lengthen':
        prompt = `Expand this text with more details: "${text}"`;
        break;
      case 'table':
        prompt = `Convert this text into a well-formatted markdown table: "${text}"`;
        break;
      case 'fix-grammar':
        prompt = `Fix any grammar or spelling issues in this text: "${text}"`;
        break;
      case 'format':
        prompt = `Reformat this text to make it more readable: "${text}"`;
        break;
      case 'bullet-list':
        prompt = `Convert this text into a bullet point list: "${text}"`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful text editing assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const result = completion.choices[0]?.message.content || text;
    
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
