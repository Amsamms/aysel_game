import React, { useEffect, useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { getStarMessage } from '../../utils/scoring';

export const ResultScreen: React.FC = () => {
  const { state, goToLevelSelect, goToMenu } = useGame();
  const [showStars, setShowStars] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // Get the latest makeover from collection
  const latestMakeover = state.progress.collection[state.progress.collection.length - 1];
  const stars = latestMakeover?.stars || 0;
  const characterName = state.currentLevel?.character.name || 'Character';

  // Animate stars appearing
  useEffect(() => {
    const starTimers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= stars; i++) {
      const timer = setTimeout(() => {
        setShowStars(i);
      }, i * 500);
      starTimers.push(timer);
    }

    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, stars * 500 + 300);

    const buttonTimer = setTimeout(() => {
      setShowButtons(true);
    }, stars * 500 + 800);

    return () => {
      starTimers.forEach(clearTimeout);
      clearTimeout(messageTimer);
      clearTimeout(buttonTimer);
    };
  }, [stars]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 overflow-hidden relative">
      {/* Celebration particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
              fontSize: `${16 + Math.random() * 16}px`,
            }}
          >
            {['✨', '💖', '⭐', '🌟', '💫'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-pink-200 animate-pulse">
          ✨ Makeover Complete! ✨
        </h1>

        {/* Character info */}
        <div className="bg-purple-800/50 rounded-2xl px-8 py-4">
          <p className="text-purple-200">You transformed</p>
          <p className="text-2xl font-bold text-white">{characterName}</p>
        </div>

        {/* Stars */}
        <div className="flex gap-4 my-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`transform transition-all duration-500 ${
                i <= showStars
                  ? 'scale-100 opacity-100'
                  : 'scale-0 opacity-0'
              }`}
            >
              <span
                className={`text-6xl ${
                  i <= showStars ? 'text-yellow-400 animate-bounce' : 'text-gray-600'
                }`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  textShadow: i <= showStars ? '0 0 20px #fbbf24' : 'none',
                }}
              >
                ⭐
              </span>
            </div>
          ))}
        </div>

        {/* Message */}
        <div
          className={`transition-all duration-500 ${
            showMessage ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <p className="text-xl text-pink-300 font-bold">{getStarMessage(stars)}</p>
          {latestMakeover && (
            <p className="text-purple-300 mt-2">
              {latestMakeover.appliedItems.length} magical items used
            </p>
          )}
        </div>

        {/* Total stars */}
        <div
          className={`bg-yellow-500/20 rounded-full px-6 py-3 transition-all duration-500 ${
            showMessage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-yellow-300 font-bold">
            Total: {state.progress.totalStars} ⭐
          </span>
        </div>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mt-4 transition-all duration-500 ${
            showButtons ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <button
            onClick={goToLevelSelect}
            className="btn-magic text-lg px-8 py-3"
          >
            🎮 Next Level
          </button>
          <button
            onClick={goToMenu}
            className="px-8 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold transition-colors"
          >
            🏠 Home
          </button>
        </div>

        {/* Unlock message if new level unlocked */}
        {state.currentLevel && state.currentLevel.id < 10 && (
          <div
            className={`mt-4 bg-green-500/20 rounded-full px-6 py-2 transition-all duration-500 ${
              showButtons ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-green-300">
              🔓 Level {state.currentLevel.id + 1} Unlocked!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
