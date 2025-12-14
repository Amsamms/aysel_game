import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { levels, isLevelUnlocked } from '../../data/levels';
import type { Level } from '../../types';

interface LevelCardProps {
  level: Level;
  isUnlocked: boolean;
  stars: number;
  onSelect: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, isUnlocked, stars, onSelect }) => {
  return (
    <button
      onClick={isUnlocked ? onSelect : undefined}
      disabled={!isUnlocked}
      className={`relative w-full aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
        isUnlocked
          ? 'transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 cursor-pointer'
          : 'opacity-50 cursor-not-allowed grayscale'
      }`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${
          isUnlocked
            ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600'
            : 'bg-gradient-to-br from-gray-600 to-gray-800'
        }`}
      />

      {/* Character silhouette placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl opacity-80">
          {isUnlocked ? getCharacterEmoji(level.id) : '🔒'}
        </div>
      </div>

      {/* Level info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-white font-bold text-sm">{level.name}</p>
        <p className="text-pink-300 text-xs">{level.character.name}</p>
      </div>

      {/* Stars */}
      {isUnlocked && (
        <div className="absolute top-2 right-2 flex gap-0.5">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`text-lg ${i <= stars ? 'text-yellow-400' : 'text-gray-600'}`}
            >
              ⭐
            </span>
          ))}
        </div>
      )}

      {/* Level number */}
      <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-purple-900/80 flex items-center justify-center">
        <span className="text-white font-bold text-sm">{level.id}</span>
      </div>
    </button>
  );
};

// Get emoji for each character
function getCharacterEmoji(levelId: number): string {
  const emojis = ['🧚', '🧜‍♀️', '🦄', '🌙', '🌸', '❄️', '☀️', '🌑', '🌈', '👑'];
  return emojis[levelId - 1] || '✨';
}

export const LevelSelect: React.FC = () => {
  const { goToMenu, selectLevel, state } = useGame();
  const { unlockedLevels, collection } = state.progress;

  // Get stars for each level
  const getStarsForLevel = (levelId: number): number => {
    const makeover = collection.find((m) => m.levelId === levelId);
    return makeover?.stars || 0;
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-purple-900/50">
        <button
          onClick={goToMenu}
          className="w-12 h-12 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center text-2xl transition-colors"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-pink-200">Choose Your Level</h1>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Level grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              isUnlocked={isLevelUnlocked(level.id, unlockedLevels)}
              stars={getStarsForLevel(level.id)}
              onSelect={() => selectLevel(level)}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="p-4 bg-purple-900/50">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-purple-200 mb-2">
            <span>Progress</span>
            <span>{unlockedLevels.length}/10 levels</span>
          </div>
          <div className="h-3 bg-purple-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedLevels.length / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
