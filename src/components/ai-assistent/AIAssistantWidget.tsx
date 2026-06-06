// src/components/ai/AIAssistant.tsx

import React, { useState, useRef } from 'react';
import {
  Bot, Send, Mic, Volume2,
  Sun, Moon, Maximize2,
  Minimize2, X
} from 'lucide-react';

import { useAIAssistant } from '../../hooks/useAIAssistant';
import type { AIMessage } from '../../types/aiAssistant';

interface AIAssistantProps {
  userId: string;
  token: string;
  userRole: string;
  onClose?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  userId,
  token,
  userRole,
  onClose
}) => {

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    startListening,
    stopListening,
    toggleSpeaking = () => {},   // ✅ FIX: safe fallback
    messagesEndRef
  } = useAIAssistant(userId, token);

  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isExpanded ? 'w-96 h-[600px]' : 'w-80 h-96'
      }`}
    >

      {/* MAIN BOX */}
      <div
        className={`rounded-2xl shadow-2xl overflow-hidden border h-full flex flex-col ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >

        {/* HEADER */}
        <div
          className={`p-4 text-white ${
            isDarkMode
              ? 'bg-gray-800'
              : 'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}
        >
          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-3">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="text-sm font-semibold">AI Assistant</h3>
                <p className="text-xs opacity-80">Online</p>
              </div>
            </div>

            <div className="flex gap-2">

              <button onClick={() => toggleSpeaking()}>
                <Volume2 className="w-4 h-4" />
              </button>

              <button onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? <Sun /> : <Moon />}
              </button>

              <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 /> : <Maximize2 />}
              </button>

              {onClose && (
                <button onClick={onClose}>
                  <X />
                </button>
              )}

            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {messages.length === 0 && (
            <div className="text-center text-gray-500">
              <Bot className="mx-auto mb-2" />
              <p>Ask me anything about your health</p>
            </div>
          )}

          {messages.map((msg: AIMessage) => (
            <div key={msg.id} className="text-sm">
              <div
                className={`p-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <p className="text-xs text-gray-400">Typing...</p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t flex gap-2">

          <button onMouseDown={startListening} onMouseUp={stopListening}>
            <Mic />
          </button>

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 p-2 border rounded"
            placeholder="Ask something..."
          />

          <button onClick={handleSend}>
            <Send />
          </button>

        </div>

        {error && (
          <div className="text-red-500 text-xs p-2">{error}</div>
        )}

      </div>
    </div>
  );
};

export default AIAssistant;