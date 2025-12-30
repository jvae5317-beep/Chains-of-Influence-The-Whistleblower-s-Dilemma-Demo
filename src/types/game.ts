// Core game types for Chains of Influence

export type FactionId = 'administrators' | 'bloodlines' | 'fixers' | 'reformists';

export interface FactionReputation {
  administrators: number;
  bloodlines: number;
  fixers: number;
  reformists: number;
}

export interface FavorDebt {
  id: string;
  npcId: string;
  npcName: string;
  description: string;
  weight: number; // 1-5 scale of importance
  faction?: FactionId;
}

export interface FavorDebts {
  owedToPlayer: FavorDebt[];
  owedByPlayer: FavorDebt[];
}

export interface Resources {
  influence: number;  // 0-100: Political capital
  exposure: number;   // 0-100: Visibility to enemies
  morality: number;   // 0-100: Moral standing
}

export interface GameState {
  currentScene: string;
  choicesMade: ChoiceMade[];
  factionReputation: FactionReputation;
  favorDebts: FavorDebts;
  resources: Resources;
  unlockedDocuments: string[];
  gameFlags: Record<string, boolean | string | number>;
  playtimeSeconds: number;
}

export interface ChoiceMade {
  sceneId: string;
  choiceId: string;
}

export interface GameSave {
  id: string;
  userId: string;
  slotNumber: number;
  saveName: string;
  currentScene: string;
  choicesMade: ChoiceMade[];
  factionReputation: FactionReputation;
  favorDebts: FavorDebts;
  resources: Resources;
  unlockedDocuments: string[];
  gameFlags: Record<string, boolean | string | number>;
  playtimeSeconds: number;
  createdAt: string;
  updatedAt: string;
}

// Story scene types
export interface Choice {
  id: string;
  text: string;
  condition?: ChoiceCondition;
  effects: ChoiceEffect[];
  nextScene: string;
  flavorText?: string; // Shown on hover
}

export interface ChoiceCondition {
  type: 'flag' | 'resource' | 'faction' | 'favor';
  key: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'has' | 'not_has';
  value: string | number | boolean;
}

export interface ChoiceEffect {
  type: 'faction' | 'resource' | 'flag' | 'favor_gain' | 'favor_lose' | 'favor_debt' | 'document';
  target: string;
  value: number | string | boolean | FavorDebt;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  faction: FactionId;
  description: string;
  disposition: 'hostile' | 'wary' | 'neutral' | 'friendly' | 'allied';
  personality: string[];
}

export interface Scene {
  id: string;
  title: string;
  location?: string;
  narrative: string[];  // Array of paragraphs
  speaker?: NPC;
  dialogue?: string[];
  choices: Choice[];
  documents?: string[]; // Document IDs to show
  ambiance?: 'tense' | 'calm' | 'urgent' | 'dark' | 'hopeful';
  isEnding?: boolean;
  endingType?: 'expose' | 'shadow' | 'betray' | 'cycle';
}

export interface Document {
  id: string;
  type: 'memo' | 'email' | 'article' | 'file' | 'note' | 'report' | 'letter' | 'news';
  title: string;
  from?: string;
  to?: string;
  date?: string;
  content: string[];
  classification?: 'confidential' | 'secret' | 'public';
  redacted?: boolean;
  annotations?: string[];
}

// Faction info
export interface Faction {
  id: FactionId;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface Character {
  id: string
  name: string
  role: "administrators" | "bloodlines" | "fixers" | "reformists"
  traits: string[]
  description?: string         // optional detailed description
  image?: string               // URL to character portrait
  influence?: number           // numeric value for corruption/pressure
}


export const FACTIONS: Record<FactionId, Faction> = {
  administrators: {
    id: 'administrators',
    name: 'The Administrators',
    description: 'Bureaucrats controlling budgets and public projects. They move slowly but wield immense institutional power.',
    color: 'blue',
    icon: '🏛️',
  },
  bloodlines: {
    id: 'bloodlines',
    name: 'The Bloodlines',
    description: 'Political dynasties ruling regions for generations. Their influence runs through family, marriage, and inheritance.',
    color: 'red',
    icon: '👑',
  },
  fixers: {
    id: 'fixers',
    name: 'The Fixers',
    description: 'Middlemen and lobbyists who arrange deals in shadows. They know everyone and everything has a price.',
    color: 'purple',
    icon: '🎭',
  },
  reformists: {
    id: 'reformists',
    name: 'The Reformists',
    description: 'Journalists, activists, and idealists fighting for transparency. Dangerous to the powerful, dangerous to know.',
    color: 'emerald',
    icon: '📰',
  },
};

// Initial game state
export const INITIAL_GAME_STATE: GameState = {
  currentScene: 'intro',
  choicesMade: [],
  factionReputation: {
    administrators: 0,
    bloodlines: 0,
    fixers: 0,
    reformists: 0,
  },
  favorDebts: {
    owedToPlayer: [],
    owedByPlayer: [],
  },
  resources: {
    influence: 50,
    exposure: 10,
    morality: 50,
  },
  unlockedDocuments: [],
  gameFlags: {},
  playtimeSeconds: 0,
};
