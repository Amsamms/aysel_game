import React from 'react';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  maxStars = 3,
  size = 'md',
  animated = false,
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          className={`${sizeClasses[size]} transition-all duration-300 ${
            i < stars
              ? `text-yellow-400 ${animated ? 'animate-bounce' : ''}`
              : 'text-gray-600'
          }`}
          style={{
            animationDelay: animated ? `${i * 0.1}s` : undefined,
            textShadow: i < stars ? '0 0 10px #fbbf24' : 'none',
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
};
