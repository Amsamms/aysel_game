import type { GameProgress, GameSettings } from '../types';

const STORAGE_KEY = 'enchanted_glamour_kingdom_progress';

const defaultSettings: GameSettings = {
  musicEnabled: true,
  sfxEnabled: true,
  musicVolume: 0.5,
  sfxVolume: 0.7,
};

const defaultProgress: GameProgress = {
  currentLevel: 1,
  unlockedLevels: [1],
  collection: [],
  totalStars: 0,
  settings: defaultSettings,
};

export const loadProgress = (): GameProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to handle new properties
      return {
        ...defaultProgress,
        ...parsed,
        settings: { ...defaultSettings, ...parsed.settings },
      };
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  return defaultProgress;
};

export const saveProgress = (progress: GameProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

export const resetProgress = (): GameProgress => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
  return defaultProgress;
};

export const unlockLevel = (progress: GameProgress, levelId: number): GameProgress => {
  if (progress.unlockedLevels.includes(levelId)) {
    return progress;
  }
  const updated = {
    ...progress,
    unlockedLevels: [...progress.unlockedLevels, levelId],
  };
  saveProgress(updated);
  return updated;
};
