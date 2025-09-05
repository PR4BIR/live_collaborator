import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 
            'You are an AI assistant in a collaborative text editor. ' +
            'You can either respond conversationally or perform edits on the text content. ' +
            'If you want to edit the text content, start your response with [EDIT] followed by instructions, ' +
            'then provide the edited text between [START_EDIT] and [END_EDIT] tags.',
        },
        ...messages,
      ],
    });

    return NextResponse.json({
      message: completion.choices[0].message
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
