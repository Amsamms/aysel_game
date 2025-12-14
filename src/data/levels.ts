import type { Level } from '../types';
import { characters } from './characters';
import { allItems } from './items';

// Each level has access to all items, but some are highlighted based on theme
export const levels: Level[] = [
  {
    id: 1,
    name: 'Spring Garden',
    character: characters[0], // Forest Fairy
    backgroundUrl: '/assets/backgrounds/spring-garden.jpg',
    availableItems: allItems,
    unlockRequirement: null,
  },
  {
    id: 2,
    name: 'Ocean Dreams',
    character: characters[1], // Water Mermaid
    backgroundUrl: '/assets/backgrounds/ocean-dreams.jpg',
    availableItems: allItems,
    unlockRequirement: 1,
  },
  {
    id: 3,
    name: 'Rainbow Magic',
    character: characters[2], // Unicorn Princess
    backgroundUrl: '/assets/backgrounds/rainbow-magic.jpg',
    availableItems: allItems,
    unlockRequirement: 2,
  },
  {
    id: 4,
    name: 'Starlight Night',
    character: characters[3], // Moon Fairy
    backgroundUrl: '/assets/backgrounds/starlight-night.jpg',
    availableItems: allItems,
    unlockRequirement: 3,
  },
  {
    id: 5,
    name: 'Enchanted Garden',
    character: characters[4], // Flower Spirit
    backgroundUrl: '/assets/backgrounds/enchanted-garden.jpg',
    availableItems: allItems,
    unlockRequirement: 4,
  },
  {
    id: 6,
    name: 'Ice Palace',
    character: characters[5], // Crystal Mermaid
    backgroundUrl: '/assets/backgrounds/ice-palace.jpg',
    availableItems: allItems,
    unlockRequirement: 5,
  },
  {
    id: 7,
    name: 'Golden Kingdom',
    character: characters[6], // Sun Princess
    backgroundUrl: '/assets/backgrounds/golden-kingdom.jpg',
    availableItems: allItems,
    unlockRequirement: 6,
  },
  {
    id: 8,
    name: 'Mystic Forest',
    character: characters[7], // Shadow Fairy
    backgroundUrl: '/assets/backgrounds/mystic-forest.jpg',
    availableItems: allItems,
    unlockRequirement: 7,
  },
  {
    id: 9,
    name: 'Cloud Castle',
    character: characters[8], // Rainbow Unicorn
    backgroundUrl: '/assets/backgrounds/cloud-castle.jpg',
    availableItems: allItems,
    unlockRequirement: 8,
  },
  {
    id: 10,
    name: 'Enchanted Throne',
    character: characters[9], // Queen of Magic
    backgroundUrl: '/assets/backgrounds/enchanted-throne.jpg',
    availableItems: allItems,
    unlockRequirement: 9,
  },
];

export const getLevelById = (id: number): Level | undefined => {
  return levels.find((level) => level.id === id);
};

export const isLevelUnlocked = (levelId: number, unlockedLevels: number[]): boolean => {
  const level = getLevelById(levelId);
  if (!level) return false;
  if (level.unlockRequirement === null) return true;
  return unlockedLevels.includes(level.unlockRequirement);
};
