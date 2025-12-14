import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { categories, getItemsByCategory } from '../../data/items';
import type { ItemCategory, MakeupItem } from '../../types';

interface CategoryTabProps {
  category: { id: ItemCategory; name: string; icon: string };
  isSelected: boolean;
  onSelect: () => void;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ category, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all min-w-[60px] ${
        isSelected
          ? 'bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/30 scale-105'
          : 'bg-purple-800/50 hover:bg-purple-700/50'
      }`}
    >
      <span className="text-2xl">{category.icon}</span>
      <span className={`text-xs mt-1 ${isSelected ? 'text-white' : 'text-purple-300'}`}>
        {category.name}
      </span>
    </button>
  );
};

interface ItemButtonProps {
  item: MakeupItem;
  onSelect: () => void;
}

const ItemButton: React.FC<ItemButtonProps> = ({ item, onSelect }) => {
  // Rarity colors
  const rarityColors = {
    common: 'from-gray-500 to-gray-600 border-gray-400',
    rare: 'from-blue-500 to-purple-600 border-blue-400',
    legendary: 'from-yellow-400 to-orange-500 border-yellow-300',
  };

  const rarityGlow = {
    common: '',
    rare: 'shadow-blue-500/30',
    legendary: 'shadow-yellow-500/50 animate-pulse',
  };

  return (
    <button
      onClick={onSelect}
      className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${rarityColors[item.rarity]}
        border-2 flex items-center justify-center transition-all hover:scale-110
        shadow-lg ${rarityGlow[item.rarity]}`}
    >
      {/* Item preview - placeholder colored circle */}
      <div
        className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center"
        title={item.name}
      >
        {getCategoryEmoji(item.category)}
      </div>

      {/* Rarity indicator */}
      {item.rarity === 'legendary' && (
        <span className="absolute -top-1 -right-1 text-sm">✨</span>
      )}
      {item.rarity === 'rare' && (
        <span className="absolute -top-1 -right-1 text-sm">💎</span>
      )}
    </button>
  );
};

function getCategoryEmoji(category: ItemCategory): string {
  const emojis: Record<ItemCategory, string> = {
    lips: '💋',
    eyes: '👁️',
    cheeks: '🌸',
    hair: '💇',
    accessories: '👑',
    wings: '🦋',
  };
  return emojis[category];
}

export const ItemPanel: React.FC = () => {
  const { state, selectCategory, applyItem, undoItem, resetMakeover, completeMakeover } = useGame();
  const { selectedCategory, appliedItems, currentLevel } = state;

  if (!currentLevel) return null;

  const currentItems = selectedCategory ? getItemsByCategory(selectedCategory) : [];

  const handleApplyItem = (item: MakeupItem) => {
    // Calculate position based on item's default position
    const position = { ...item.position };
    applyItem(item, position);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 via-purple-900/95 to-purple-900/80 backdrop-blur-sm">
      {/* Category tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onSelect={() => selectCategory(category.id)}
          />
        ))}
      </div>

      {/* Items grid */}
      <div className="px-4 py-3 border-t border-purple-700/50">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {currentItems.map((item) => (
            <ItemButton
              key={item.id}
              item={item}
              onSelect={() => handleApplyItem(item)}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center px-4 py-3 border-t border-purple-700/50">
        <div className="flex gap-2">
          <button
            onClick={undoItem}
            disabled={appliedItems.length === 0}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ↩️ Undo
          </button>
          <button
            onClick={resetMakeover}
            disabled={appliedItems.length === 0}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            🔄 Reset
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-purple-300 text-sm">
            {appliedItems.length} items
          </span>
          <button
            onClick={completeMakeover}
            disabled={appliedItems.length === 0}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all shadow-lg shadow-pink-500/30"
          >
            ✨ Done!
          </button>
        </div>
      </div>
    </div>
  );
};
