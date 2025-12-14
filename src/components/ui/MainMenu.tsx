import React, { useEffect, useState } from 'react';
import { useGame } from '../../contexts/GameContext';

// Floating sparkle component
const Sparkle: React.FC<{ delay: number; left: string; size: number }> = ({ delay, left, size }) => {
  return (
    <div
      className="absolute text-yellow-300 animate-pulse pointer-events-none"
      style={{
        left,
        top: `${Math.random() * 100}%`,
        fontSize: `${size}px`,
        animationDelay: `${delay}s`,
        opacity: 0.6 + Math.random() * 0.4,
      }}
    >
      ✨
    </div>
  );
};

export const MainMenu: React.FC = () => {
  const { goToLevelSelect, goToCollection, state, toggleMusic, toggleSfx } = useGame();
  const [sparkles, setSparkles] = useState<Array<{ id: number; delay: number; left: string; size: number }>>([]);

  // Generate floating sparkles
  useEffect(() => {
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      left: `${Math.random() * 100}%`,
      size: 16 + Math.random() * 24,
    }));
    setSparkles(generated);
  }, []);

  const { musicEnabled, sfxEnabled } = state.progress.settings;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 animate-pulse" />

      {/* Floating sparkles */}
      {sparkles.map((s) => (
        <Sparkle key={s.id} delay={s.delay} left={s.left} size={s.size} />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 p-8">
        {/* Title */}
        <div className="text-center animate-float">
          <h1
            className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-lg"
            style={{ textShadow: '0 0 30px rgba(236, 72, 153, 0.5)' }}
          >
            ✨ Enchanted ✨
          </h1>
          <h2
            className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mt-2"
            style={{ textShadow: '0 0 30px rgba(251, 191, 36, 0.5)' }}
          >
            Glamour Kingdom
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-pink-200 text-lg md:text-xl text-center max-w-md">
          Transform magical creatures with enchanted makeup and sparkles!
        </p>

        {/* Stars collected */}
        <div className="flex items-center gap-2 bg-purple-900/50 px-6 py-3 rounded-full border border-purple-400/30">
          <span className="text-2xl">⭐</span>
          <span className="text-yellow-300 font-bold text-xl">{state.progress.totalStars}</span>
          <span className="text-purple-200">stars collected</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={goToLevelSelect}
            className="btn-magic text-xl py-4 animate-glow"
          >
            🎮 Play
          </button>

          <button
            onClick={goToCollection}
            className="btn-magic text-xl py-4 bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            📚 Collection ({state.progress.collection.length}/10)
          </button>
        </div>

        {/* Settings */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={toggleMusic}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
              musicEnabled
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {musicEnabled ? '🎵' : '🔇'}
          </button>
          <button
            onClick={toggleSfx}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
              sfxEnabled
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/50'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {sfxEnabled ? '🔊' : '🔈'}
          </button>
        </div>

        {/* For Aysel */}
        <p className="text-purple-300/60 text-sm mt-8">Made with 💜 for Aysel</p>
      </div>
    </div>
  );
};
