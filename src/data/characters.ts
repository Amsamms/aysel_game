import type { Character } from '../types';

// Get the base URL for assets (handles GitHub Pages deployment)
const BASE = import.meta.env.BASE_URL;

export const characters: Character[] = [
  {
    id: 'forest-fairy',
    name: 'Luna the Forest Fairy',
    baseImageUrl: `${BASE}assets/characters/forest-fairy.svg`,
    theme: 'Spring Garden',
    unlocked: true,
  },
  {
    id: 'water-mermaid',
    name: 'Marina the Water Mermaid',
    baseImageUrl: `${BASE}assets/characters/water-mermaid.svg`,
    theme: 'Ocean Dreams',
    unlocked: false,
  },
  {
    id: 'unicorn-princess',
    name: 'Starlight the Unicorn Princess',
    baseImageUrl: `${BASE}assets/characters/unicorn-princess.svg`,
    theme: 'Rainbow Magic',
    unlocked: false,
  },
  {
    id: 'moon-fairy',
    name: 'Celeste the Moon Fairy',
    baseImageUrl: `${BASE}assets/characters/moon-fairy.svg`,
    theme: 'Starlight Night',
    unlocked: false,
  },
  {
    id: 'flower-spirit',
    name: 'Petal the Flower Spirit',
    baseImageUrl: `${BASE}assets/characters/flower-spirit.svg`,
    theme: 'Enchanted Garden',
    unlocked: false,
  },
  {
    id: 'crystal-mermaid',
    name: 'Crystal the Ice Mermaid',
    baseImageUrl: `${BASE}assets/characters/crystal-mermaid.svg`,
    theme: 'Ice Palace',
    unlocked: false,
  },
  {
    id: 'sun-princess',
    name: 'Aurora the Sun Princess',
    baseImageUrl: `${BASE}assets/characters/sun-princess.svg`,
    theme: 'Golden Kingdom',
    unlocked: false,
  },
  {
    id: 'shadow-fairy',
    name: 'Violet the Shadow Fairy',
    baseImageUrl: `${BASE}assets/characters/shadow-fairy.svg`,
    theme: 'Mystic Forest',
    unlocked: false,
  },
  {
    id: 'rainbow-unicorn',
    name: 'Prism the Rainbow Unicorn',
    baseImageUrl: `${BASE}assets/characters/rainbow-unicorn.svg`,
    theme: 'Cloud Castle',
    unlocked: false,
  },
  {
    id: 'queen-magic',
    name: 'Empress Enchantia',
    baseImageUrl: `${BASE}assets/characters/queen-magic.svg`,
    theme: 'Enchanted Throne',
    unlocked: false,
  },
];
