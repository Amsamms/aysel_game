// Game Types for Enchanted Glamour Kingdom

export type ItemCategory = 'lips' | 'eyes' | 'cheeks' | 'hair' | 'accessories' | 'wings';

export interface MakeupItem {
  id: string;
  name: string;
  category: ItemCategory;
  imageUrl: string;
  rarity: 'common' | 'rare' | 'legendary';
  position: { x: number; y: number }; // Position offset on character
  scale?: number;
}

export interface Character {
  id: string;
  name: string;
  baseImageUrl: string;
  theme: string;
  unlocked: boolean;
}

export interface Level {
  id: number;
  name: string;
  character: Character;
  backgroundUrl: string;
  availableItems: MakeupItem[];
  unlockRequirement: number | null; // Previous level ID or null if first level
}

export interface SavedMakeover {
  id: string;
  levelId: number;
  characterId: string;
  appliedItems: string[]; // Item IDs
  stars: number;
  timestamp: number;
  screenshotUrl?: string;
}

export interface GameProgress {
  currentLevel: number;
  unlockedLevels: number[];
  collection: SavedMakeover[];
  totalStars: number;
  settings: GameSettings;
}

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

export type GameScreen = 'menu' | 'levelSelect' | 'game' | 'result' | 'collection';

export interface AppliedItem {
  item: MakeupItem;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
}

export interface GameState {
  screen: GameScreen;
  currentLevel: Level | null;
  appliedItems: AppliedItem[];
  selectedCategory: ItemCategory | null;
  progress: GameProgress;
  isLoading: boolean;
}

export type GameAction =
  | { type: 'SET_SCREEN'; screen: GameScreen }
  | { type: 'SELECT_LEVEL'; level: Level }
  | { type: 'APPLY_ITEM'; item: MakeupItem; position: { x: number; y: number } }
  | { type: 'REMOVE_LAST_ITEM' }
  | { type: 'RESET_MAKEOVER' }
  | { type: 'SELECT_CATEGORY'; category: ItemCategory | null }
  | { type: 'COMPLETE_LEVEL'; stars: number }
  | { type: 'LOAD_PROGRESS'; progress: GameProgress }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'TOGGLE_SFX' };
