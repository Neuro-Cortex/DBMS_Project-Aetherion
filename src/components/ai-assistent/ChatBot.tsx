import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare,
  Send,
  Bot,
  User,
  X,
  Minimize2,
  Maximize2,
  Phone,
  MoreVertical,
  Sparkles,
  Mic
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Avatar } from '../../ui/Avatar';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  type?: 'text' | 'appointment' | 'prescription' | 'emergency';
}

export interface ChatBotProps {
  variant?: 'glass' | 'gradient' | 'neon';
  isOpen?: boolean;
  onToggle?: () => void;
  onMessageSend?: (message: string) => void;
  className?: string;
}

// ============================================
// CHATBOT COMPONENT
// ============================================
export const ChatBot: React.FC<ChatBotProps> = ({
  variant = 'glass',
  isOpen: controlledOpen,
  onToggle,
  onMessageSend,
  className,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! 👋 I am MediBot, your AI health assistant. How can I help you today?',
      timestamp: new Date(),
      type: 'text',
    },
    {
      id: '2',
      sender: 'bot',
      text: 'You can ask me about:\n• Symptoms & conditions\n• Medicine information\n• Booking appointments\n• Emergency guidance',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    onMessageSend?.(input);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateBotResponse = (userInput: string): ChatMessage => {
    const lowerInput = userInput.toLowerCase();
    let text = '';
    let type: ChatMessage['type'] = 'text';

    if (lowerInput.includes('headache') || lowerInput.includes('head pain')) {
      text = 'I see you\'re experiencing a headache. 🤕\n\nTo help you better, can you tell me:\n1. How long have you had this headache?\n2. Where exactly is the pain located?\n3. Rate the pain from 1-10.\n\nIn the meantime, try drinking water and resting in a dark room.';
      type = 'prescription';
    } else if (lowerInput.includes('appointment') || lowerInput.includes('book')) {
      text = 'I can help you book an appointment! 📅\n\nWhich department are you looking for?\n• General Medicine\n• Cardiology\n• Neurology\n• Orthopedics\n\nOr I can find the best doctor for your symptoms.';
      type = 'appointment';
    } else if (lowerInput.includes('emergency') || lowerInput.includes('help')) {
      text = '🚨 If this is a medical emergency, please call emergency services immediately:\n\n📞 Emergency: 911\n📞 Ambulance: 108\n\nI\'ve also notified the nearest hospital. Stay calm and provide your location.';
      type = 'emergency';
    } else if (lowerInput.includes('medicine') || lowerInput.includes('drug')) {
      text = 'I can provide medicine information. 💊\n\nPlease tell me the medicine name, and I\'ll give you:\n• Dosage information\n• Side effects\n• Drug interactions\n• Availability at nearby pharmacies';
    } else {
      text = 'Thank you for sharing that with me. 😊\n\nBased on what you\'ve said, I recommend:\n1. Rest and stay hydrated\n2. Monitor your symptoms\n3. If symptoms persist, consult a doctor\n\nWould you like me to book an appointment with a specialist?';
    }

    return {
      id: Date.now().toString(),
      sender: 'bot',
      text,
      timestamp: new Date(),
      type,
    };
  };

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(prev => !prev);
    }
  };

  return (
    <div className={twMerge('fixed bottom-6 right-6 z-50', className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mb-4"
          >
            <GlassmorphicCard
              variant={variant}
              className={clsx(
                'w-[360px] sm:w-[400px] overflow-hidden flex flex-col',
                isMinimized ? 'h-16' : 'h-[550px]'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-cyan-600/20 to-purple-600/20">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Avatar name="MediBot" size="sm" className="border-2 border-cyan-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-bold text-sm">MediBot AI</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white/60">Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconOnly
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    iconOnly
                    onClick={handleToggle}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          className={clsx(
                            'flex gap-3',
                            message.sender === 'user' && 'flex-row-reverse'
                          )}
                        >
                          <div className={clsx(
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                            message.sender === 'bot' ? 'bg-cyan-500/20' : 'bg-purple-500/20'
                          )}>
                            {message.sender === 'bot' ? (
                              <Bot className="w-4 h-4 text-cyan-400" />
                            ) : (
                              <User className="w-4 h-4 text-purple-400" />
                            )}
                          </div>

                          <div className={clsx(
                            'max-w-[75%] p-3 rounded-2xl text-sm',
                            message.sender === 'bot'
                              ? 'bg-white/10 text-white/90 rounded-tl-none'
                              : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                          )}>
                            <p className="whitespace-pre-line">{message.text}</p>
                            <p className={clsx(
                              'text-[10px] mt-1',
                              message.sender === 'bot' ? 'text-white/40' : 'text-white/60'
                            )}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex gap-3"
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-cyan-500/20">
                            <Bot className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none">
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 bg-white/60 rounded-full"
                                  animate={{ y: [0, -5, 0] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                                />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  <div className="px-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
                    {['Book Appointment', 'Check Symptoms', 'Medicine Info', 'Emergency'].map((action) => (
                      <Button
                        key={action}
                        variant="glassmorphic"
                        size="xs"
                        onClick={() => {
                          setInput(action);
                        }}
                        className="flex-shrink-0"
                      >
                        {action}
                      </Button>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" iconOnly>
                        <Mic className="w-4 h-4" />
                      </Button>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className={clsx(
                          'p-2 rounded-xl transition-all',
                          input.trim()
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                            : 'bg-white/10 text-white/40'
                        )}
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </GlassmorphicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={clsx(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all',
          'bg-gradient-to-r from-cyan-600 to-blue-600 text-white',
          isOpen && 'opacity-0 pointer-events-none'
        )}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
};