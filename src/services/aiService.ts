import type { AIMessage, AIResponse, AIUserContext } from '../types/aiAssistant';

type SendOptions = {
  userId?: string;
  token?: string;
  context?: Partial<AIUserContext>;
};

class AIService {
  private token = '';
  private userId = 'guest';

  setAuth(token: string, userId: string) {
    this.token = token;
    this.userId = userId;
  }

  setToken(token: string) {
    this.token = token;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  async getUserContext(): Promise<AIUserContext> {
    return {
      userId: this.userId,
      userName: 'Aetherion User',
      userRole: 'client',
      accountType: 'standard',
      lastLogin: new Date().toISOString(),
      preferences: {
        language: 'en',
        voiceEnabled: false,
        theme: 'dark',
        fontSize: 'medium',
      },
    };
  }

  async sendMessage(message: string, options: SendOptions | string = {}): Promise<AIResponse> {
    return {
      message: `I understand your question: "${message}". For urgent symptoms, please contact emergency care. For general guidance, share your age, symptoms, duration, and any medication you are taking.`,
      type: 'text',
      suggestions: [
        'Check nearby doctors',
        'Review medicine reminders',
        'Open emergency help',
      ],
      confidence: 0.72,
    };
  }

  async speechToText(_audioBlob: Blob): Promise<string> {
    return 'Voice message received';
  }

  async getRecommendations(context?: Partial<AIUserContext>) {
    return [
      {
        id: `rec-${Date.now()}`,
        title: 'Schedule a routine checkup',
        description: 'Keep your health profile updated and book a doctor visit if symptoms persist.',
        priority: 'medium',
        category: 'general',
        context,
      },
    ];
  }

  async analyzeSymptoms(symptoms: string[]) {
    return {
      severity: symptoms.length > 3 ? 'medium' : 'low',
      summary: 'Local symptom analysis is available as a fallback.',
      recommendations: ['Monitor symptoms', 'Hydrate', 'Consult a doctor if symptoms worsen'],
    };
  }
}

export const aiService = new AIService();
export default aiService;
