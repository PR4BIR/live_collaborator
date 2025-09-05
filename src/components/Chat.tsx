import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  isProcessing: boolean;
}

export default function Chat({ onSendMessage, messages, isProcessing }: ChatProps) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const message = input;
    setInput('');
    await onSendMessage(message);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat with AI</h2>
      </div>
      
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-100 ml-6' 
                  : 'bg-gray-100 mr-6'
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {message.role === 'user' ? 'You' : 'AI'}
              </div>
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="p-3 rounded-lg bg-gray-100 mr-6">
              <div className="text-sm font-medium mb-1">AI</div>
              <div className="text-sm">Thinking...</div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <Separator />
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end gap-2">
          <Textarea 
            placeholder="Type a message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow resize-none min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isProcessing}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
