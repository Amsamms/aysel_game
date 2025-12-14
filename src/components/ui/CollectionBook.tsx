import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { characters } from '../../data/characters';
import type { SavedMakeover } from '../../types';

interface CollectionCardProps {
  makeover: SavedMakeover;
  characterName: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ makeover, characterName }) => {
  return (
    <div className="relative bg-gradient-to-br from-purple-700 to-pink-700 rounded-2xl overflow-hidden shadow-lg">
      {/* Character placeholder */}
      <div className="aspect-square flex items-center justify-center bg-purple-800/50">
        <div className="text-6xl">
          {getCharacterEmoji(makeover.characterId)}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-purple-900/80">
        <p className="text-white font-bold text-sm truncate">{characterName}</p>
        <p className="text-purple-300 text-xs">
          {makeover.appliedItems.length} items used
        </p>
      </div>

      {/* Stars */}
      <div className="absolute top-2 right-2 flex gap-0.5 bg-purple-900/80 px-2 py-1 rounded-full">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={`text-sm ${i <= makeover.stars ? 'text-yellow-400' : 'text-gray-600'}`}
          >
            ⭐
          </span>
        ))}
      </div>
    </div>
  );
};

// Get emoji for character
function getCharacterEmoji(characterId: string): string {
  const emojiMap: Record<string, string> = {
    'forest-fairy': '🧚',
    'water-mermaid': '🧜‍♀️',
    'unicorn-princess': '🦄',
    'moon-fairy': '🌙',
    'flower-spirit': '🌸',
    'crystal-mermaid': '❄️',
    'sun-princess': '☀️',
    'shadow-fairy': '🌑',
    'rainbow-unicorn': '🌈',
    'queen-magic': '👑',
  };
  return emojiMap[characterId] || '✨';
}

// Empty slot placeholder
const EmptySlot: React.FC<{ index: number }> = ({ index }) => (
  <div className="bg-purple-900/30 rounded-2xl border-2 border-dashed border-purple-600/50 aspect-square flex flex-col items-center justify-center">
    <span className="text-4xl text-purple-600/50">🔒</span>
    <span className="text-purple-400/50 text-sm mt-2">Level {index + 1}</span>
  </div>
);

export const CollectionBook: React.FC = () => {
  const { goToMenu, state } = useGame();
  const { collection, totalStars } = state.progress;

  // Get character name by ID
  const getCharacterName = (characterId: string): string => {
    const character = characters.find((c) => c.id === characterId);
    return character?.name || 'Unknown';
  };

  // Create a map of best makeover per level
  const bestMakeovers = new Map<number, SavedMakeover>();
  collection.forEach((m) => {
    const existing = bestMakeovers.get(m.levelId);
    if (!existing || m.stars > existing.stars) {
      bestMakeovers.set(m.levelId, m);
    }
  });

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-purple-900/50">
        <button
          onClick={goToMenu}
          className="w-12 h-12 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center text-2xl transition-colors"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-pink-200">📚 Collection</h1>
        <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full">
          <span className="text-xl">⭐</span>
          <span className="text-yellow-300 font-bold">{totalStars}</span>
        </div>
      </div>

      {/* Collection grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {collection.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <span className="text-6xl mb-4">📖</span>
            <h2 className="text-2xl font-bold text-pink-200 mb-2">Your collection is empty!</h2>
            <p className="text-purple-300">Complete makeovers to fill your collection book with beautiful creations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {/* Show slots for all 10 levels */}
            {Array.from({ length: 10 }, (_, i) => {
              const levelId = i + 1;
              const makeover = bestMakeovers.get(levelId);

              if (makeover) {
                return (
                  <CollectionCard
                    key={levelId}
                    makeover={makeover}
                    characterName={getCharacterName(makeover.characterId)}
                  />
                );
              }

              return <EmptySlot key={levelId} index={i} />;
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="p-4 bg-purple-900/50">
        <div className="max-w-md mx-auto flex justify-around">
          <div className="text-center">
            <p className="text-3xl font-bold text-pink-300">{bestMakeovers.size}</p>
            <p className="text-purple-300 text-sm">Creatures</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-300">{totalStars}</p>
            <p className="text-purple-300 text-sm">Total Stars</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-300">{collection.length}</p>
            <p className="text-purple-300 text-sm">Makeovers</p>
          </div>
        </div>
      </div>
    </div>
  );
};
