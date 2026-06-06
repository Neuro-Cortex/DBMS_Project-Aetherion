import React from 'react';
import { Mic } from 'lucide-react';

interface AIVoiceButtonProps {
  onToggle?: () => void;
  isListening?: boolean;
}

export const AIVoiceButton: React.FC<AIVoiceButtonProps> = ({ onToggle, isListening = false }) => {
  return (
    <button
      onClick={onToggle}
      className={`p-3 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <Mic className="w-5 h-5" />
    </button>
  );
};

export default AIVoiceButton;
