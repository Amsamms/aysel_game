import type { AppliedItem, ItemCategory } from '../types';

// Categories needed for max stars
const ALL_CATEGORIES: ItemCategory[] = ['lips', 'eyes', 'cheeks', 'hair', 'accessories', 'wings'];

/**
 * Calculate star rating based on variety of items used
 * - 1 Star: Used 1-3 different categories
 * - 2 Stars: Used 4-5 different categories
 * - 3 Stars: Used all 6 categories
 */
export const calculateStars = (appliedItems: AppliedItem[]): number => {
  // Get unique categories used
  const usedCategories = new Set<ItemCategory>();

  appliedItems.forEach((applied) => {
    usedCategories.add(applied.item.category);
  });

  const categoryCount = usedCategories.size;

  let stars = 0;

  if (categoryCount >= 6) {
    stars = 3;
  } else if (categoryCount >= 4) {
    stars = 2;
  } else if (categoryCount >= 1) {
    stars = 1;
  }

  return stars;
};

/**
 * Get a message based on the star rating
 */
export const getStarMessage = (stars: number): string => {
  switch (stars) {
    case 3:
      return 'Perfect! You used all categories!';
    case 2:
      return 'Great job! Almost complete!';
    case 1:
      return 'Good start! Try more categories!';
    default:
      return 'Keep trying!';
  }
};

/**
 * Get missing categories for achieving 3 stars
 */
export const getMissingCategories = (appliedItems: AppliedItem[]): ItemCategory[] => {
  const usedCategories = new Set<ItemCategory>();

  appliedItems.forEach((applied) => {
    usedCategories.add(applied.item.category);
  });

  return ALL_CATEGORIES.filter((cat) => !usedCategories.has(cat));
};

/**
 * Check if makeover is complete (at least one item applied)
 */
export const isMakeoverComplete = (appliedItems: AppliedItem[]): boolean => {
  return appliedItems.length > 0;
};
