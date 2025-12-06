import type { Gift } from '@/db/schema';

// Age group categories
export type AgeGroupCategory =
  | 'toddler'
  | 'preschool'
  | 'early_school'
  | 'tween'
  | 'teen';

// Budget tiers
export type BudgetTier = 'budget' | 'moderate' | 'premium';

// Agent status for timeline
export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed';

// Image Elf types
export interface ImageElfInput {
  imageUrl: string;
  sessionId: string;
}

export interface ImageElfOutput {
  estimatedAgeRange: string;
  ageGroupCategory: AgeGroupCategory;
  visibleInterestsFromImage: string[];
  colorPreferencesFromClothing: string[];
  environmentClues: string[];
  confidence: number;
}

// Profile Elf types
export interface ProfileFormData {
  name: string;
  age: number;
  interests: string[];
  budget: 'low' | 'medium' | 'high';
  specialNotes?: string;
}

export interface ProfileElfInput {
  formData: ProfileFormData;
  imageAnalysis: ImageElfOutput | null;
  sessionId: string;
}

export interface KidProfileData {
  name: string;
  ageGroup: AgeGroupCategory;
  primaryInterests: string[];
  secondaryInterests: string[];
  personalityTraits: string[];
  giftCategories: string[];
  budgetTier: BudgetTier;
  avoidCategories?: string[];
}

export interface ProfileElfOutput {
  profile: KidProfileData;
  confidence: number;
}

// Gift Match Elf types
export interface GiftMatchElfInput {
  profile: KidProfileData;
  sessionId: string;
}

export interface ScoredRecommendation {
  gift: Gift;
  score: number;
  reasoning: string;
  matchedInterests: string[];
}

export interface GiftMatchElfOutput {
  recommendations: ScoredRecommendation[];
}

// Narration Elf types
export interface NarrationElfInput {
  profile: KidProfileData;
  recommendations: ScoredRecommendation[];
  sessionId: string;
}

// Narration output is streamed text

// Agent orchestration types
export interface AgentEvent {
  type: 'status' | 'output' | 'error' | 'complete' | 'detail';
  agentId: 'image' | 'profile' | 'gift-match' | 'narration';
  status?: AgentStatus;
  data?: unknown;
  error?: string;
  detail?: string; // Behind-the-scenes detail message
  timestamp: number;
}

export interface OrchestratorState {
  sessionId: string;
  currentAgent: string | null;
  agents: {
    image: { status: AgentStatus; output?: ImageElfOutput };
    profile: { status: AgentStatus; output?: ProfileElfOutput };
    'gift-match': { status: AgentStatus; output?: GiftMatchElfOutput };
    narration: { status: AgentStatus; content?: string };
  };
  error?: string;
}

// UI Timeline types
export interface TimelineStep {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  duration?: number;
  output?: unknown;
}

// Gift categories for inventory
export const GIFT_CATEGORIES = [
  'educational',
  'creative',
  'outdoor',
  'tech',
  'books',
  'games',
  'sports',
  'music',
  'building',
  'dolls',
  'vehicles',
  'animals',
  'science',
  'art',
] as const;

export type GiftCategory = (typeof GIFT_CATEGORIES)[number];
