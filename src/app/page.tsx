'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import Editor from '@/components/Editor';
import Chat from '@/components/Chat';
import FloatingToolbar from '@/components/FloatingToolbar';
import { APIToggle } from '@/components/APIToggle';

// Sample initial code
const DEFAULT_CODE = `// Welcome to the Collaborative Editor!
// You can type or paste code here.
// Select text to see the floating toolbar with AI actions.
// Use the chat on the right to ask for help or request edits.

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [editorContent, setEditorContent] = useState(DEFAULT_CODE);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI assistant. I can help with your code or text. You can also select text in the editor to use the floating toolbar for quick actions.'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useMockAPI, setUseMockAPI] = useState(true); // Use mock API by default
  
  // Selection state
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState({ from: 0, to: 0 });
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

  // Reset toolbar when content changes
  useEffect(() => {
    setToolbarVisible(false);
  }, [editorContent]);

  // Handle selection change
  const handleSelectionChange = useCallback((text: string, from: number, to: number) => {
    if (text) {
      setSelectedText(text);
      setSelectionRange({ from, to });
      
      // Calculate toolbar position - this is a simplistic approach
      // In a real app, you'd want to use getBoundingClientRect() to position it properly
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setToolbarPosition({
          x: rect.left + (rect.width / 2),
          y: rect.top - 10
        });
        setToolbarVisible(true);
      }
    } else {
      setToolbarVisible(false);
    }
  }, []);

  // Handle sending a message to the AI
  const handleSendMessage = async (message: string) => {
    try {
      setIsProcessing(true);
      
      // Add user message
      const newMessages = [
        ...messages,
        { role: 'user' as const, content: message }
      ];
      setMessages(newMessages);
      
      // Send to API (either mock or real)
      const endpoint = useMockAPI ? '/api/chat-mock' : '/api/chat';
      console.log(`Using ${useMockAPI ? 'mock' : 'real'} API endpoint: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (!data.message || !data.message.content) {
        throw new Error('Invalid response format from API');
      }
      
      const aiMessage = data.message.content;
      
      // Check if response contains edit instructions
      if (aiMessage.includes('[EDIT]')) {
        const editInstruction = aiMessage.split('[EDIT]')[1].split('[START_EDIT]')[0].trim();
        const editContentMatch = aiMessage.match(/\[START_EDIT\]([\s\S]*)\[END_EDIT\]/);
        const editContent = editContentMatch ? editContentMatch[1].trim() : '';
        
        // Apply the edit
        if (editContent) {
          setEditorContent(editContent);
          toast.success('AI applied edits to the editor content');
        }
        
        // Add AI response to chat
        setMessages([...newMessages, { role: 'assistant' as const, content: editInstruction }]);
      } else {
        // Just a regular message
        setMessages([...newMessages, { role: 'assistant' as const, content: aiMessage }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response');
      
      // Add error message to chat
      setMessages([
        ...messages,
        { role: 'user' as const, content: message },
        { role: 'assistant' as const, content: 'Sorry, I encountered an error processing your request.' }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle toolbar actions
  const handleToolbarAction = async (action: string, text: string) => {
    try {
      setToolbarVisible(false);
      setIsProcessing(true);
      
      // Call API to process the text action (either mock or real)
      const endpoint = useMockAPI ? '/api/text-action-mock' : '/api/text-action';
      console.log(`Using ${useMockAPI ? 'mock' : 'real'} API endpoint for text action: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process text action');
      }
      
      const data = await response.json();
      
      // Replace the selected text in the editor
      if (data.result) {
        const before = editorContent.substring(0, selectionRange.from);
        const after = editorContent.substring(selectionRange.to);
        setEditorContent(before + data.result + after);
        toast.success(`Successfully applied ${action}`);
      }
    } catch (error) {
      console.error('Error processing text action:', error);
      toast.error(`Failed to apply ${action}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex h-screen">
      {/* Editor section */}
      <div className="flex-1 h-full p-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Live Collaborative Editor</h1>
          <APIToggle useMockAPI={useMockAPI} onToggle={setUseMockAPI} />
        </div>
        
        <div className="h-[calc(100%-3rem)] relative">
          <Editor 
            value={editorContent} 
            onChange={setEditorContent}
            onSelectionChange={handleSelectionChange}
          />
          
          <FloatingToolbar 
            visible={toolbarVisible}
            position={toolbarPosition}
            selectedText={selectedText}
            onAction={handleToolbarAction}
          />
        </div>
      </div>
      
      {/* Chat sidebar */}
      <div className="w-1/3 h-full border-l">
        <Chat 
          onSendMessage={handleSendMessage}
          messages={messages}
          isProcessing={isProcessing}
        />
      </div>
      
      {/* Toast notifications */}
      <Toaster position="bottom-right" />
    </main>
  );
}
