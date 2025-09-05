import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client only when the API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: Request) {
  try {
    // Check if the OpenAI client is initialized
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    console.error('Error in chat API:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
