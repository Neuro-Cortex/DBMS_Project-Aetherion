// src/hooks/useAIAssistant.ts
// CLEAN & SINGLE VERSION - No duplicates

import { useState, useCallback, useRef, useEffect } from 'react';
import { AIMessage, AIResponse, AIUserContext, AIVoiceConfig } from '../types/aiAssistant';
import { aiService } from '../services/aiService';

export const useAIAssistant = (userId: string, token: string) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState<AIUserContext | null>(null);
  const [conversationId, setConversationId] = useState<string>('');
  const [voiceConfig, setVoiceConfig] = useState<AIVoiceConfig>({
    isListening: false,
    isSpeaking: false,
    transcript: ''
  });
  const [error, setError] = useState<string>('');

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ============================================
  // INITIALIZATION
  // ============================================
  useEffect(() => {
    aiService.setToken(token);
    aiService.setUserId(userId);
    loadUserContext();
  }, [userId, token]);

  // ============================================
  // AUTO SCROLL
  // ============================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============================================
  // LOAD USER CONTEXT
  // ============================================
  const loadUserContext = async () => {
    try {
      const context = await aiService.getUserContext();
      setUserContext(context);
    } catch (err) {
      console.error('Failed to load user context:', err);
    }
  };

  // ============================================
  // MOCK AI RESPONSES
  // ============================================
  const getMockResponse = (input: string): string => {
    const query = input.toLowerCase();
    
    if (query.includes('blood') || query.includes('রক্ত') || query.includes('blood group')) {
      return 'আপনার রক্তের গ্রুপ হলো O+ (O Positive)। আপনি একজন ইউনিভার্সাল ডোনার হতে পারেন! 🩸';
    } 
    else if (query.includes('appointment') || query.includes('অ্যাপয়েন্টমেন্ট')) {
      return 'আপনার পরবর্তী অ্যাপয়েন্টমেন্ট আগামী ২০ জানুয়ারি, Dr. Sarah Wilson এর সাথে Women Care Hospital এ। সময়: সকাল ১০:০০ টা। 📅';
    } 
    else if (query.includes('medicine') || query.includes('ওষুধ') || query.includes('medication')) {
      return 'আপনার বর্তমান ওষুধের তালিকা:\n\n1. Prenatal Vitamins - প্রতিদিন ১ টা\n2. Iron Supplement - প্রতিদিন ১ টা\n3. Calcium + Vitamin D - প্রতিদিন ২ টা\n\nকোনো ওষুধ মিস করবেন না! 💊';
    } 
    else if (query.includes('doctor') || query.includes('ডাক্তার')) {
      return 'আপনার ডাক্তার:\n\nDr. Emily White\nSpecialization: Gynecology\nHospital: Women Care Hospital\nPhone: +1 (555) 333-4444\nRating: ⭐ 4.9/5';
    } 
    else if (query.includes('report') || query.includes('রিপোর্ট') || query.includes('health report')) {
      return 'আপনার সর্বশেষ হেলথ রিপোর্ট (১৫ জানুয়ারি ২০২৫):\n\n• Blood Pressure: 120/80 (Normal)\n• Blood Sugar: 95 mg/dL (Normal)\n• Hemoglobin: 11.5 g/dL (Normal)\n• Weight: 65 kg\n\nসব কিছু স্বাভাবিক আছে! ✅';
    } 
    else if (query.includes('hello') || query.includes('hi') || query.includes('হ্যালো') || query.includes('hey')) {
      return 'Hello! আমি আপনার AI Health Assistant। আমি আপনাকে স্বাস্থ্য সংক্রান্ত যেকোনো প্রশ্নে help করতে পারি। কিভাবে help করতে পারি? 😊';
    } 
    else if (query.includes('emergency') || query.includes('জরুরি') || query.includes('help')) {
      return '🚨 জরুরি অবস্থা! দয়া করে সাথে সাথে 911 এ কল করুন অথবা SOS বাটন টিপুন। আপনার অবস্থান স্বয়ংক্রিয়ভাবে শেয়ার করা হবে।';
    }
    else if (query.includes('hospital') || query.includes('হাসপাতাল')) {
      return 'আপনার নিকটতম হাসপাতাল:\n\n1. City General Hospital - 2.5 km (8 min)\n2. Metro Hospital - 5.2 km (15 min)\n3. Women Care Hospital - 3.8 km (12 min)\n\nসবগুলোতে Emergency সেবা আছে।';
    }
    else {
      return 'আমি আপনার প্রশ্ন বুঝতে পেরেছি। কিন্তু আরও তথ্যের প্রয়োজন। দয়া করে আরেকটু বিস্তারিত বলুন। আমি আপনাকে help করতে প্রস্তুত! 🤔';
    }
  };

  // ============================================
  // SEND MESSAGE
  // ============================================
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError('');

    try {
      // Try real API first, fallback to mock
      let response: AIResponse;
      
      try {
        response = await aiService.sendMessage(content, conversationId);
      } catch {
        // Fallback to mock response
        await new Promise(resolve => setTimeout(resolve, 1500));
        response = {
          message: getMockResponse(content),
          type: 'text',
          confidence: 0.95
        };
      }

      // Add AI response
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        type: response.type || 'text',
        data: response.data,
        emotion: response.emotion as any
      };

      setMessages(prev => [...prev, aiMessage]);

      // Speak response if voice enabled
      if (voiceConfig.isSpeaking && response.message) {
        speakText(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get response');
      
      // Add error message
      const errorMessage: AIMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, voiceConfig.isSpeaking]);

  // ============================================
  // VOICE INPUT - START LISTENING
  // ============================================
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        audioChunks.current = [];
        
        try {
          const text = await aiService.speechToText(audioBlob);
          setVoiceConfig(prev => ({ ...prev, transcript: text }));
          sendMessage(text);
        } catch (err) {
          console.error('Speech to text failed:', err);
        }
      };

      recorder.start();
      mediaRecorder.current = recorder;
      setVoiceConfig(prev => ({ ...prev, isListening: true }));
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  }, [sendMessage]);

  // ============================================
  // VOICE INPUT - STOP LISTENING
  // ============================================
  const stopListening = useCallback(() => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setVoiceConfig(prev => ({ ...prev, isListening: false }));
    }
  }, []);

  // ============================================
  // TEXT TO SPEECH
  // ============================================
  const speakText = useCallback(async (text: string) => {
    // Use browser's built-in speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback to API
      try {
        const audioUrl = await aiService.textToSpeech(text);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (err) {
        console.error('Text to speech failed:', err);
      }
    }
  }, []);

  // ============================================
  // TOGGLE SPEAKING
  // ============================================
  const toggleSpeaking = useCallback(() => {
    setVoiceConfig(prev => ({ ...prev, isSpeaking: !prev.isSpeaking }));
  }, []);

  // ============================================
  // CLEAR CHAT
  // ============================================
  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId('');
    setError('');
  }, []);

  // ============================================
  // RETURN
  // ============================================
  return {
    messages,
    isLoading,
    userContext,
    voiceConfig,
    error,
    sendMessage,
    startListening,
    stopListening,
    toggleSpeaking,
    clearChat,
    messagesEndRef
  };
};