import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { useGame } from '../../contexts/GameContext';
import { ItemPanel } from '../ui/ItemPanel';

// Particle for sparkle effects
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rotation: number;
  color: number;
}

export const GameCanvas: React.FC = () => {
  const { state, goToLevelSelect } = useGame();
  const { currentLevel, appliedItems } = state;
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize PixiJS
  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;

    const initApp = async () => {
      const app = new Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x1e1b4b,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      canvasRef.current?.appendChild(app.canvas);
      appRef.current = app;

      // Create main container
      const mainContainer = new Container();
      mainContainer.label = 'main';
      app.stage.addChild(mainContainer);

      // Create character container
      const characterContainer = new Container();
      characterContainer.label = 'character';
      characterContainer.x = app.screen.width / 2;
      characterContainer.y = app.screen.height / 2 - 80;
      mainContainer.addChild(characterContainer);

      // Create particles container
      const particlesContainer = new Container();
      particlesContainer.label = 'particles';
      mainContainer.addChild(particlesContainer);

      // Draw placeholder character
      drawCharacter(characterContainer);

      // Start animation loop
      app.ticker.add((ticker) => {
        updateParticles(particlesContainer, ticker.deltaTime);
      });

      setIsLoaded(true);
    };

    initApp();

    // Handle resize
    const handleResize = () => {
      if (appRef.current) {
        appRef.current.renderer.resize(window.innerWidth, window.innerHeight);
        const main = appRef.current.stage.getChildByLabel('main') as Container;
        const char = main?.getChildByLabel('character') as Container;
        if (char) {
          char.x = window.innerWidth / 2;
          char.y = window.innerHeight / 2 - 80;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, []);

  // Draw placeholder character
  const drawCharacter = (container: Container) => {
    // Clear existing
    container.removeChildren();

    // Body circle (anime style)
    const body = new Graphics();
    body.circle(0, 100, 80);
    body.fill({ color: 0xffd5c8 }); // Skin tone
    container.addChild(body);

    // Head circle
    const head = new Graphics();
    head.circle(0, -20, 100);
    head.fill({ color: 0xffd5c8 });
    container.addChild(head);

    // Big anime eyes (left)
    const leftEye = new Graphics();
    leftEye.ellipse(-35, -30, 25, 35);
    leftEye.fill({ color: 0xffffff });
    leftEye.circle(-35, -25, 15);
    leftEye.fill({ color: 0x6366f1 }); // Purple iris
    leftEye.circle(-30, -30, 6);
    leftEye.fill({ color: 0xffffff }); // Shine
    container.addChild(leftEye);

    // Big anime eyes (right)
    const rightEye = new Graphics();
    rightEye.ellipse(35, -30, 25, 35);
    rightEye.fill({ color: 0xffffff });
    rightEye.circle(35, -25, 15);
    rightEye.fill({ color: 0x6366f1 });
    rightEye.circle(40, -30, 6);
    rightEye.fill({ color: 0xffffff });
    container.addChild(rightEye);

    // Cute nose
    const nose = new Graphics();
    nose.circle(0, 10, 5);
    nose.fill({ color: 0xffb8a8 });
    container.addChild(nose);

    // Lips placeholder
    const lips = new Graphics();
    lips.ellipse(0, 45, 20, 8);
    lips.fill({ color: 0xffb6c1 });
    container.addChild(lips);

    // Hair placeholder
    const hair = new Graphics();
    hair.ellipse(0, -80, 110, 60);
    hair.fill({ color: 0x8b5cf6 }); // Purple hair
    container.addChild(hair);

    // Character name
    if (currentLevel) {
      const style = new TextStyle({
        fontFamily: 'Comic Sans MS',
        fontSize: 18,
        fill: 0xffffff,
        align: 'center',
      });
      const nameText = new Text({ text: currentLevel.character.name, style });
      nameText.anchor.set(0.5);
      nameText.y = 220;
      container.addChild(nameText);
    }
  };

  // Update particles
  const updateParticles = (container: Container, delta: number) => {
    // Update existing particles
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += 0.1 * delta; // Gravity
      p.life -= delta;
      p.rotation += 0.1 * delta;
      return p.life > 0;
    });

    // Redraw particles
    container.removeChildren();
    particlesRef.current.forEach((p) => {
      const graphics = new Graphics();
      const alpha = p.life / p.maxLife;
      graphics.star(0, 0, 4, p.size, p.size * 0.5);
      graphics.fill({ color: p.color, alpha });
      graphics.x = p.x;
      graphics.y = p.y;
      graphics.rotation = p.rotation;
      container.addChild(graphics);
    });
  };

  // Spawn sparkles at position
  const spawnSparkles = useCallback((x: number, y: number, count: number = 10) => {
    const colors = [0xfef08a, 0xfbbf24, 0xf472b6, 0xc084fc, 0x60a5fa];
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 3,
        life: 30 + Math.random() * 30,
        maxLife: 60,
        size: 4 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }, []);

  // Draw applied items
  useEffect(() => {
    if (!appRef.current || !isLoaded) return;

    const main = appRef.current.stage.getChildByLabel('main') as Container;
    const character = main?.getChildByLabel('character') as Container;
    if (!character) return;

    // Redraw character with applied items
    drawCharacter(character);

    // Draw applied items on top
    appliedItems.forEach((applied, index) => {
      const graphics = new Graphics();

      // Draw colored circles representing items
      const categoryColors: Record<string, number> = {
        lips: 0xff6b8a,
        eyes: 0x818cf8,
        cheeks: 0xfda4af,
        hair: 0xa78bfa,
        accessories: 0xfbbf24,
        wings: 0x67e8f9,
      };

      const color = categoryColors[applied.item.category] || 0xffffff;
      graphics.circle(applied.position.x, applied.position.y, 15);
      graphics.fill({ color, alpha: 0.8 });

      // Add glow effect
      graphics.circle(applied.position.x, applied.position.y, 20);
      graphics.fill({ color, alpha: 0.3 });

      character.addChild(graphics);

      // Spawn sparkles when item is new
      if (index === appliedItems.length - 1) {
        spawnSparkles(
          character.x + applied.position.x,
          character.y + applied.position.y,
          15
        );
      }
    });
  }, [appliedItems, isLoaded, currentLevel, spawnSparkles]);

  // Continuous ambient sparkles
  useEffect(() => {
    if (!appRef.current || !isLoaded) return;

    const interval = setInterval(() => {
      // Random ambient sparkle
      if (Math.random() > 0.7) {
        spawnSparkles(
          Math.random() * window.innerWidth,
          Math.random() * (window.innerHeight * 0.6),
          3
        );
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isLoaded, spawnSparkles]);

  if (!currentLevel) return null;

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-purple-900/80 to-transparent">
        <button
          onClick={goToLevelSelect}
          className="w-12 h-12 rounded-full bg-purple-700/80 hover:bg-purple-600 flex items-center justify-center text-2xl transition-colors backdrop-blur-sm"
        >
          ←
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-pink-200">{currentLevel.name}</h2>
          <p className="text-sm text-purple-300">{currentLevel.character.name}</p>
        </div>
        <div className="w-12" />
      </div>

      {/* PixiJS Canvas */}
      <div ref={canvasRef} className="w-full h-full" />

      {/* Item Panel */}
      <ItemPanel />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-900">
          <div className="text-center">
            <span className="text-4xl animate-bounce">✨</span>
            <p className="text-pink-200 mt-4">Loading magic...</p>
          </div>
        </div>
      )}
    </div>
  );
};
