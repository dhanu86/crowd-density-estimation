import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipHelpProps {
  text: string;
  title?: string;
}

export const TooltipHelp: React.FC<TooltipHelpProps> = ({ text, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1 z-20">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none"
        aria-label="Help info"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-dark-800 border border-slate-700 rounded-lg shadow-xl text-xs text-slate-200 pointer-events-none z-50">
          {title && <div className="font-semibold text-cyan-400 mb-1">{title}</div>}
          <div>{text}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-dark-800" />
        </div>
      )}
    </div>
  );
};
