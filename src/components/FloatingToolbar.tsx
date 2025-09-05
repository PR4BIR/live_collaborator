import React from 'react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from './ui/dropdown-menu';
import { 
  Table2,
  Minimize,
  Maximize,
  List
} from 'lucide-react';

interface FloatingToolbarProps {
  visible: boolean;
  position: { x: number; y: number };
  selectedText: string;
  onAction: (action: string, text: string) => void;
}

export default function FloatingToolbar({ 
  visible, 
  position, 
  selectedText, 
  onAction 
}: FloatingToolbarProps) {
  if (!visible) return null;

  return (
    <div 
      className="absolute z-50 bg-white shadow-lg rounded-lg border p-2 flex items-center gap-1"
      style={{ 
        top: `${position.y}px`, 
        left: `${position.x}px`,
        transform: 'translateY(-100%)' 
      }}
    >
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 h-8 w-8"
        onClick={() => onAction('shorten', selectedText)}
      >
        <Minimize className="h-4 w-4" />
        <span className="sr-only">Shorten</span>
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 h-8 w-8"
        onClick={() => onAction('lengthen', selectedText)}
      >
        <Maximize className="h-4 w-4" />
        <span className="sr-only">Lengthen</span>
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 h-8 w-8"
        onClick={() => onAction('table', selectedText)}
      >
        <Table2 className="h-4 w-4" />
        <span className="sr-only">Convert to Table</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-8 w-8"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">More Options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onAction('fix-grammar', selectedText)}>
            Fix Grammar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction('format', selectedText)}>
            Format
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction('bullet-list', selectedText)}>
            Convert to Bullet List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
