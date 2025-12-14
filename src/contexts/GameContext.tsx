import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction, Level, MakeupItem, AppliedItem, ItemCategory, SavedMakeover } from '../types';
import { loadProgress, saveProgress, unlockLevel } from '../utils/storage';
import { calculateStars } from '../utils/scoring';

const initialState: GameState = {
  screen: 'menu',
  currentLevel: null,
  appliedItems: [],
  selectedCategory: null,
  progress: loadProgress(),
  isLoading: true,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'SELECT_LEVEL':
      return {
        ...state,
        currentLevel: action.level,
        appliedItems: [],
        selectedCategory: 'lips',
        screen: 'game',
      };

    case 'APPLY_ITEM': {
      const newAppliedItem: AppliedItem = {
        item: action.item,
        position: action.position,
        rotation: 0,
        scale: 1,
      };
      return {
        ...state,
        appliedItems: [...state.appliedItems, newAppliedItem],
      };
    }

    case 'REMOVE_LAST_ITEM':
      return {
        ...state,
        appliedItems: state.appliedItems.slice(0, -1),
      };

    case 'RESET_MAKEOVER':
      return {
        ...state,
        appliedItems: [],
      };

    case 'SELECT_CATEGORY':
      return { ...state, selectedCategory: action.category };

    case 'COMPLETE_LEVEL': {
      if (!state.currentLevel) return state;

      const makeover: SavedMakeover = {
        id: `${state.currentLevel.id}-${Date.now()}`,
        levelId: state.currentLevel.id,
        characterId: state.currentLevel.character.id,
        appliedItems: state.appliedItems.map((a) => a.item.id),
        stars: action.stars,
        timestamp: Date.now(),
      };

      // Unlock next level
      const nextLevelId = state.currentLevel.id + 1;
      let updatedProgress = {
        ...state.progress,
        collection: [...state.progress.collection, makeover],
        totalStars: state.progress.totalStars + action.stars,
      };

      if (nextLevelId <= 10) {
        updatedProgress = unlockLevel(updatedProgress, nextLevelId);
      }

      saveProgress(updatedProgress);

      return {
        ...state,
        progress: updatedProgress,
        screen: 'result',
      };
    }

    case 'LOAD_PROGRESS':
      return { ...state, progress: action.progress, isLoading: false };

    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };

    case 'TOGGLE_MUSIC': {
      const updatedSettings = {
        ...state.progress.settings,
        musicEnabled: !state.progress.settings.musicEnabled,
      };
      const updatedProgress = { ...state.progress, settings: updatedSettings };
      saveProgress(updatedProgress);
      return { ...state, progress: updatedProgress };
    }

    case 'TOGGLE_SFX': {
      const updatedSettings = {
        ...state.progress.settings,
        sfxEnabled: !state.progress.settings.sfxEnabled,
      };
      const updatedProgress = { ...state.progress, settings: updatedSettings };
      saveProgress(updatedProgress);
      return { ...state, progress: updatedProgress };
    }

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Helper functions
  goToMenu: () => void;
  goToLevelSelect: () => void;
  goToCollection: () => void;
  selectLevel: (level: Level) => void;
  applyItem: (item: MakeupItem, position: { x: number; y: number }) => void;
  undoItem: () => void;
  resetMakeover: () => void;
  selectCategory: (category: ItemCategory | null) => void;
  completeMakeover: () => void;
  toggleMusic: () => void;
  toggleSfx: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load progress on mount
  useEffect(() => {
    const progress = loadProgress();
    dispatch({ type: 'LOAD_PROGRESS', progress });
  }, []);

  // Helper functions
  const goToMenu = () => dispatch({ type: 'SET_SCREEN', screen: 'menu' });
  const goToLevelSelect = () => dispatch({ type: 'SET_SCREEN', screen: 'levelSelect' });
  const goToCollection = () => dispatch({ type: 'SET_SCREEN', screen: 'collection' });
  const selectLevel = (level: Level) => dispatch({ type: 'SELECT_LEVEL', level });
  const applyItem = (item: MakeupItem, position: { x: number; y: number }) =>
    dispatch({ type: 'APPLY_ITEM', item, position });
  const undoItem = () => dispatch({ type: 'REMOVE_LAST_ITEM' });
  const resetMakeover = () => dispatch({ type: 'RESET_MAKEOVER' });
  const selectCategory = (category: ItemCategory | null) =>
    dispatch({ type: 'SELECT_CATEGORY', category });
  const completeMakeover = () => {
    const stars = calculateStars(state.appliedItems);
    dispatch({ type: 'COMPLETE_LEVEL', stars });
  };
  const toggleMusic = () => dispatch({ type: 'TOGGLE_MUSIC' });
  const toggleSfx = () => dispatch({ type: 'TOGGLE_SFX' });

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        goToMenu,
        goToLevelSelect,
        goToCollection,
        selectLevel,
        applyItem,
        undoItem,
        resetMakeover,
        selectCategory,
        completeMakeover,
        toggleMusic,
        toggleSfx,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
