
export interface RoleplayMessage {
  id: string;
  character: string;
  message: string;
  timestamp: string;
  type: 'dnd' | 'relationship' | 'romantic' | 'beauty-beast' | 'intimacy' | 'fantasy' | 'growth';
  emotion?: string;
  isAdult?: boolean;
  connectionStrength?: number;
  fantasyRating?: number;
  growthProgress?: number;
  achievements?: string[];
  popularity?: number;
  matchScore?: number;
  characterLevel?: number;
  experience?: number;
  badges?: string[];
  liked?: boolean;
  saves?: number;
  responseOptions?: string[];
  userCustomization?: {
    theme?: string;
    fontStyle?: string;
    atmosphere?: string;
  };
  scenarioTemplate?: string;
  interactiveElements?: {
    choices?: string[];
    outcomes?: Record<string, string>;
    triggers?: string[];
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  dateUnlocked?: string;
  category: 'writer' | 'explorer' | 'creator' | 'social' | 'master';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface CharacterProfile {
  id: string;
  name: string;
  avatar: string;
  backstory: string;
  personality: string[];
  preferences: string[];
  level: number;
  experience: number;
  badges: string[];
  achievements: string[];
  createdAt: string;
  stats: {
    creativity: number;
    consistency: number;
    depth: number;
    interaction: number;
    popularity: number;
  };
}

export interface RoleplayScenario {
  id: string;
  title: string;
  description: string;
  type: string;
  backgroundImage?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number;
  suggestedCharacters: string[];
  startingPrompts: string[];
  interactiveElements?: {
    choices?: string[];
    outcomes?: Record<string, string>;
    triggers?: string[];
  };
}
