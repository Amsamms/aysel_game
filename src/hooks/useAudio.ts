import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useGame } from '../contexts/GameContext';

// Sound effect types
type SfxType = 'click' | 'sparkle' | 'apply' | 'success' | 'star' | 'whoosh';

// Audio file paths
const AUDIO_PATHS = {
  music: '/assets/audio/music/magical-theme.mp3',
  sfx: {
    click: '/assets/audio/sfx/click.mp3',
    sparkle: '/assets/audio/sfx/sparkle.mp3',
    apply: '/assets/audio/sfx/apply.mp3',
    success: '/assets/audio/sfx/success.mp3',
    star: '/assets/audio/sfx/star.mp3',
    whoosh: '/assets/audio/sfx/whoosh.mp3',
  },
};

export function useAudio() {
  const { state } = useGame();
  const { musicEnabled, sfxEnabled, musicVolume, sfxVolume } = state.progress.settings;

  const musicRef = useRef<Howl | null>(null);
  const sfxRefs = useRef<Record<SfxType, Howl | null>>({
    click: null,
    sparkle: null,
    apply: null,
    success: null,
    star: null,
    whoosh: null,
  });

  // Initialize music
  useEffect(() => {
    musicRef.current = new Howl({
      src: [AUDIO_PATHS.music],
      loop: true,
      volume: musicVolume,
      preload: true,
    });

    // Initialize sound effects
    (Object.keys(AUDIO_PATHS.sfx) as SfxType[]).forEach((key) => {
      sfxRefs.current[key] = new Howl({
        src: [AUDIO_PATHS.sfx[key]],
        volume: sfxVolume,
        preload: true,
      });
    });

    return () => {
      musicRef.current?.unload();
      Object.values(sfxRefs.current).forEach((sfx) => sfx?.unload());
    };
  }, []);

  // Update music state
  useEffect(() => {
    if (!musicRef.current) return;

    if (musicEnabled) {
      if (!musicRef.current.playing()) {
        musicRef.current.play();
      }
    } else {
      musicRef.current.pause();
    }
  }, [musicEnabled]);

  // Update volumes
  useEffect(() => {
    musicRef.current?.volume(musicVolume);
  }, [musicVolume]);

  useEffect(() => {
    Object.values(sfxRefs.current).forEach((sfx) => {
      sfx?.volume(sfxVolume);
    });
  }, [sfxVolume]);

  // Play sound effect
  const playSfx = useCallback(
    (type: SfxType) => {
      if (!sfxEnabled) return;
      sfxRefs.current[type]?.play();
    },
    [sfxEnabled]
  );

  // Convenience functions
  const playClick = useCallback(() => playSfx('click'), [playSfx]);
  const playSparkle = useCallback(() => playSfx('sparkle'), [playSfx]);
  const playApply = useCallback(() => playSfx('apply'), [playSfx]);
  const playSuccess = useCallback(() => playSfx('success'), [playSfx]);
  const playStar = useCallback(() => playSfx('star'), [playSfx]);
  const playWhoosh = useCallback(() => playSfx('whoosh'), [playSfx]);

  // Start background music
  const startMusic = useCallback(() => {
    if (musicEnabled && musicRef.current && !musicRef.current.playing()) {
      musicRef.current.play();
    }
  }, [musicEnabled]);

  // Stop background music
  const stopMusic = useCallback(() => {
    musicRef.current?.stop();
  }, []);

  return {
    playSfx,
    playClick,
    playSparkle,
    playApply,
    playSuccess,
    playStar,
    playWhoosh,
    startMusic,
    stopMusic,
  };
}

// Simple audio hook for components that don't need full functionality
export function useClickSound() {
  const { playSfx } = useAudio();
  return () => playSfx('click');
}
