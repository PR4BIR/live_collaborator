import { NextResponse } from 'next/server';

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

    // Generate a mock response based on the action
    let result = '';
    
    switch (action) {
      case 'shorten':
        result = text.split(' ').slice(0, Math.max(3, text.split(' ').length / 2)).join(' ') + '...';
        break;
      case 'lengthen':
        result = text + ' Additionally, this text has been expanded with more details and examples to illustrate the concept more thoroughly.';
        break;
      case 'table':
        result = "| Column 1 | Column 2 |\n|---------|----------|\n| Data 1  | Data 2   |\n| Data 3  | Data 4   |";
        break;
      case 'fix-grammar':
        result = text.replace(/\bi\b/g, 'I').replace(/\.+/g, '.').replace(/\s+/g, ' ');
        break;
      case 'format':
        result = text.split('.').map((s: string) => s.trim()).filter((s: string) => s.length > 0).join('.\n\n');
        break;
      case 'bullet-list':
        result = text.split('.').filter((s: string) => s.trim().length > 0).map((s: string) => '- ' + s.trim()).join('\n');
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Error in mock text action API:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
