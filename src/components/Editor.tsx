import React, { useState, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { githubLight } from '@uiw/codemirror-theme-github';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange?: (text: string, from: number, to: number) => void;
}

export default function Editor({ value, onChange, onSelectionChange }: EditorProps) {
  const editorRef = useRef<EditorView | null>(null);
  
  // Handle selection changes
  const handleSelectionChange = (view: EditorView) => {
    const { from, to } = view.state.selection.main;
    if (from !== to && onSelectionChange) {
      const selectedText = view.state.doc.sliceString(from, to);
      onSelectionChange(selectedText, from, to);
    }
  };

  return (
    <div className="w-full h-full">
      <CodeMirror
        value={value}
        height="100%"
        theme={githubLight}
        extensions={[javascript()]}
        onChange={onChange}
        onCreateEditor={(view) => {
          editorRef.current = view;
          view.dom.addEventListener('mouseup', () => handleSelectionChange(view));
          view.dom.addEventListener('keyup', () => handleSelectionChange(view));
        }}
        className="border rounded-md"
      />
    </div>
  );
}
