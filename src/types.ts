export type DeviceStatus = 'on' | 'off' | 'idle' | 'warning';

export interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'camera' | 'lock' | 'audio';
  status: DeviceStatus;
  value?: string | number;
  room: string;
  // Enhanced controls
  brightness?: number; // 0-100
  color?: string; // hex
  targetTemp?: number;
  humidity?: number;
}

export type SummaryLength = 'short' | 'medium' | 'detailed';

export interface Personality {
  name: string;
  voice: string; // Voice name or identifier
  pitch: number; // 0.1 to 2
  speed: number; // 0.1 to 10
  humor: number; // 0-100
  formality: number; // 0-100
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  topic: string;
  timestamp: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  relevanceScore?: number;
}

export interface NewsPreference {
  topics: string[];
  sources: string[];
  dislikedTopics: string[];
  feedbackHistory: { articleId: string; liked: boolean; timestamp: number }[];
}

export interface SystemState {
  isVoiceActive: boolean;
  isListening: boolean;
  isLocked: boolean;
  ownerFaceVerified: boolean;
  currentTask: string | null;
  personality: Personality;
  smartHome: SmartDevice[];
  userPreferences: Record<string, any>;
  logs: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
