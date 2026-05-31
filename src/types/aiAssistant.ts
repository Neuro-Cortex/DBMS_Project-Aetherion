// src/types/aiAssistant.ts

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  type?: 'text' | 'data' | 'error' | 'suggestion';
  data?: any;
  emotion?: 'happy' | 'neutral' | 'concerned' | 'excited';
}

export interface AIUserContext {
  userId: string;
  userName: string;
  userRole: string;
  accountType: string;
  lastLogin: string;
  preferences: UserPreferences;
  healthProfile?: HealthProfile;
}

export interface UserPreferences {
  language: string;
  voiceEnabled: boolean;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
}

export interface HealthProfile {
  bloodGroup?: string;
  age?: number;
  gender?: string;
  medicalConditions?: string[];
  allergies?: string[];
}

export interface AIResponse {
  message: string;
  type: 'text' | 'data' | 'suggestion' | 'error';
  data?: any;
  suggestions?: string[];
  emotion?: string;
  sqlQuery?: string;
  confidence: number;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AISuggestion {
  id: string;
  text: string;
  category: 'health' | 'appointment' | 'medicine' | 'general';
  icon: string;
}

export interface AIVoiceConfig {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  audioUrl?: string;
}

export interface AIDataDisplay {
  type: 'table' | 'card' | 'list';
  title: string;
  data: any;
  columns?: string[];
}



// src/types/aiAssistant.ts

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  type?: 'text' | 'data' | 'error' | 'suggestion';
  data?: any;
  emotion?: 'happy' | 'neutral' | 'concerned' | 'excited';
}

export interface AIUserContext {
  userId: string;
  userName: string;
  userRole: string;
  accountType: string;
  lastLogin: string;
  preferences: UserPreferences;
  healthProfile?: HealthProfile;
}

export interface UserPreferences {
  language: string;
  voiceEnabled: boolean;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
}

export interface HealthProfile {
  bloodGroup?: string;
  age?: number;
  gender?: string;
  medicalConditions?: string[];
  allergies?: string[];
}

export interface AIResponse {
  message: string;
  type: 'text' | 'data' | 'suggestion' | 'error';
  data?: any;
  suggestions?: string[];
  emotion?: string;
  sqlQuery?: string;
  confidence: number;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AISuggestion {
  id: string;
  text: string;
  category: 'health' | 'appointment' | 'medicine' | 'general';
  icon: string;
}

export interface AIVoiceConfig {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  audioUrl?: string;
}

export interface AIDataDisplay {
  type: 'table' | 'card' | 'list';
  title: string;
  data: any;
  columns?: string[];
}