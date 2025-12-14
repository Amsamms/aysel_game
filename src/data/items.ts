import type { MakeupItem, ItemCategory } from '../types';

// Helper to generate items for a category
const createItems = (
  category: ItemCategory,
  items: Array<{ name: string; rarity: 'common' | 'rare' | 'legendary'; position: { x: number; y: number } }>
): MakeupItem[] => {
  return items.map((item, index) => ({
    id: `${category}-${index + 1}`,
    name: item.name,
    category,
    imageUrl: `/assets/makeup/${category}/${category}-${index + 1}.png`,
    rarity: item.rarity,
    position: item.position,
    scale: 1,
  }));
};

// Lips - positioned at mouth area
export const lipsItems: MakeupItem[] = createItems('lips', [
  { name: 'Rose Petal Pink', rarity: 'common', position: { x: 0, y: 80 } },
  { name: 'Cherry Blossom', rarity: 'common', position: { x: 0, y: 80 } },
  { name: 'Coral Dream', rarity: 'common', position: { x: 0, y: 80 } },
  { name: 'Fairy Berry', rarity: 'rare', position: { x: 0, y: 80 } },
  { name: 'Sparkle Gloss', rarity: 'rare', position: { x: 0, y: 80 } },
  { name: 'Rainbow Kiss', rarity: 'legendary', position: { x: 0, y: 80 } },
]);

// Eyes - positioned at eye area
export const eyesItems: MakeupItem[] = createItems('eyes', [
  { name: 'Starlight Shimmer', rarity: 'common', position: { x: 0, y: -20 } },
  { name: 'Ocean Blue', rarity: 'common', position: { x: 0, y: -20 } },
  { name: 'Forest Green', rarity: 'common', position: { x: 0, y: -20 } },
  { name: 'Sunset Orange', rarity: 'rare', position: { x: 0, y: -20 } },
  { name: 'Galaxy Purple', rarity: 'rare', position: { x: 0, y: -20 } },
  { name: 'Diamond Sparkle', rarity: 'legendary', position: { x: 0, y: -20 } },
]);

// Cheeks - positioned at cheek area
export const cheeksItems: MakeupItem[] = createItems('cheeks', [
  { name: 'Peach Glow', rarity: 'common', position: { x: 0, y: 40 } },
  { name: 'Pink Cloud', rarity: 'common', position: { x: 0, y: 40 } },
  { name: 'Coral Dust', rarity: 'common', position: { x: 0, y: 40 } },
  { name: 'Fairy Dust', rarity: 'rare', position: { x: 0, y: 40 } },
  { name: 'Glitter Blush', rarity: 'rare', position: { x: 0, y: 40 } },
  { name: 'Moonbeam Glow', rarity: 'legendary', position: { x: 0, y: 40 } },
]);

// Hair - positioned at head area
export const hairItems: MakeupItem[] = createItems('hair', [
  { name: 'Flowing Waves', rarity: 'common', position: { x: 0, y: -100 } },
  { name: 'Braided Crown', rarity: 'common', position: { x: 0, y: -100 } },
  { name: 'Curly Locks', rarity: 'common', position: { x: 0, y: -100 } },
  { name: 'Flower Braid', rarity: 'rare', position: { x: 0, y: -100 } },
  { name: 'Star Streaks', rarity: 'rare', position: { x: 0, y: -100 } },
  { name: 'Rainbow Cascade', rarity: 'legendary', position: { x: 0, y: -100 } },
]);

// Accessories - positioned at head/neck area
export const accessoriesItems: MakeupItem[] = createItems('accessories', [
  { name: 'Flower Crown', rarity: 'common', position: { x: 0, y: -120 } },
  { name: 'Crystal Tiara', rarity: 'common', position: { x: 0, y: -120 } },
  { name: 'Pearl Necklace', rarity: 'common', position: { x: 0, y: 100 } },
  { name: 'Star Earrings', rarity: 'rare', position: { x: 0, y: -10 } },
  { name: 'Magic Wand', rarity: 'rare', position: { x: 80, y: 50 } },
  { name: 'Enchanted Crown', rarity: 'legendary', position: { x: 0, y: -130 } },
]);

// Wings - positioned at back
export const wingsItems: MakeupItem[] = createItems('wings', [
  { name: 'Butterfly Wings', rarity: 'common', position: { x: 0, y: 0 } },
  { name: 'Fairy Wings', rarity: 'common', position: { x: 0, y: 0 } },
  { name: 'Crystal Wings', rarity: 'common', position: { x: 0, y: 0 } },
  { name: 'Rainbow Wings', rarity: 'rare', position: { x: 0, y: 0 } },
  { name: 'Starlight Wings', rarity: 'rare', position: { x: 0, y: 0 } },
  { name: 'Galaxy Wings', rarity: 'legendary', position: { x: 0, y: 0 } },
]);

// All items combined
export const allItems: MakeupItem[] = [
  ...lipsItems,
  ...eyesItems,
  ...cheeksItems,
  ...hairItems,
  ...accessoriesItems,
  ...wingsItems,
];

// Get items by category
export const getItemsByCategory = (category: ItemCategory): MakeupItem[] => {
  switch (category) {
    case 'lips':
      return lipsItems;
    case 'eyes':
      return eyesItems;
    case 'cheeks':
      return cheeksItems;
    case 'hair':
      return hairItems;
    case 'accessories':
      return accessoriesItems;
    case 'wings':
      return wingsItems;
    default:
      return [];
  }
};

// Category metadata
export const categories: { id: ItemCategory; name: string; icon: string }[] = [
  { id: 'lips', name: 'Lips', icon: '💋' },
  { id: 'eyes', name: 'Eyes', icon: '👁️' },
  { id: 'cheeks', name: 'Cheeks', icon: '🌸' },
  { id: 'hair', name: 'Hair', icon: '💇' },
  { id: 'accessories', name: 'Accessories', icon: '👑' },
  { id: 'wings', name: 'Wings', icon: '🦋' },
];
