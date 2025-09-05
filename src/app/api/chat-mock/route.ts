import { NextResponse } from 'next/server';

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

    // Get the last user message
    const lastUserMessage = messages.findLast(m => m.role === 'user')?.content || '';
    
    // Create a mock response based on the message
    let responseContent = '';
    
    if (lastUserMessage.toLowerCase().includes('edit') || 
        lastUserMessage.toLowerCase().includes('fix') || 
        lastUserMessage.toLowerCase().includes('change')) {
      // If the message asks for edits, return an edit instruction
      responseContent = `[EDIT] I've made the changes you requested.\n\n[START_EDIT]// Modified code based on your request\nfunction improvedGreet(name) {\n  // Added validation\n  if (!name) name = 'World';\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(improvedGreet('User'));\n[END_EDIT]`;
    } else {
      // Regular conversational response
      responseContent = `I'm a mock AI response for testing. You said: "${lastUserMessage}". How else can I help you with your code today?`;
    }

    return NextResponse.json({
      message: {
        role: 'assistant',
        content: responseContent
      }
    });
  } catch (error: any) {
    console.error('Error in mock chat API:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
