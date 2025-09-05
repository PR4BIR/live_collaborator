import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // For client-side usage (in a real app, use server-side API routes)
});

export interface AIResponse {
  content: string;
  editContent?: string;
  editInstruction?: string;
}

export async function sendMessageToAI(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
): Promise<AIResponse> {
  try {
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

    const response = completion.choices[0]?.message.content || '';
    
    // Check if response contains edit instructions
    if (response.includes('[EDIT]')) {
      const editInstruction = response.split('[EDIT]')[1].split('[START_EDIT]')[0].trim();
      const editContentMatch = response.match(/\[START_EDIT\]([\s\S]*)\[END_EDIT\]/);
      const editContent = editContentMatch ? editContentMatch[1].trim() : '';
      
      return {
        content: response,
        editContent,
        editInstruction,
      };
    }
    
    return {
      content: response,
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return {
      content: 'Sorry, I encountered an error processing your request.',
    };
  }
}

export async function processTextAction(
  action: string,
  text: string,
): Promise<string> {
  try {
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
        return text;
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful text editing assistant.' },
        { role: 'user', content: prompt },
      ],
    });
    
    return completion.choices[0]?.message.content || text;
  } catch (error) {
    console.error('Error processing text action:', error);
    return text;
  }
}
