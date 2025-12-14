import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Application, Container, Graphics, Text, TextStyle, Sprite, Assets } from 'pixi.js';
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
  const characterSpriteRef = useRef<Sprite | null>(null);
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

      // Create background container
      const bgContainer = new Container();
      bgContainer.label = 'background';
      app.stage.addChild(bgContainer);

      // Create main container
      const mainContainer = new Container();
      mainContainer.label = 'main';
      app.stage.addChild(mainContainer);

      // Create character container
      const characterContainer = new Container();
      characterContainer.label = 'character';
      characterContainer.x = app.screen.width / 2;
      characterContainer.y = app.screen.height / 2 - 50;
      mainContainer.addChild(characterContainer);

      // Create items container (for applied makeup)
      const itemsContainer = new Container();
      itemsContainer.label = 'items';
      characterContainer.addChild(itemsContainer);

      // Create particles container
      const particlesContainer = new Container();
      particlesContainer.label = 'particles';
      mainContainer.addChild(particlesContainer);

      // Load background
      if (currentLevel) {
        try {
          const bgTexture = await Assets.load(currentLevel.backgroundUrl);
          const bgSprite = new Sprite(bgTexture);
          bgSprite.width = app.screen.width;
          bgSprite.height = app.screen.height;
          bgContainer.addChild(bgSprite);
        } catch {
          // Draw gradient background if image fails
          const bg = new Graphics();
          bg.rect(0, 0, app.screen.width, app.screen.height);
          bg.fill({ color: 0x1e1b4b });
          bgContainer.addChild(bg);
        }

        // Load character SVG
        try {
          const charTexture = await Assets.load(currentLevel.character.baseImageUrl);
          const charSprite = new Sprite(charTexture);
          charSprite.anchor.set(0.5);
          charSprite.scale.set(1.2);
          characterSpriteRef.current = charSprite;
          characterContainer.addChildAt(charSprite, 0);
        } catch {
          // Draw placeholder if image fails
          drawPlaceholderCharacter(characterContainer);
        }

        // Add character name
        const style = new TextStyle({
          fontFamily: 'Comic Sans MS, cursive',
          fontSize: 20,
          fill: 0xffffff,
          align: 'center',
          dropShadow: {
            color: 0x000000,
            blur: 4,
            distance: 2,
          },
        });
        const nameText = new Text({ text: currentLevel.character.name, style });
        nameText.anchor.set(0.5);
        nameText.y = 180;
        characterContainer.addChild(nameText);
      }

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
          char.y = window.innerHeight / 2 - 50;
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
  }, [currentLevel]);

  // Draw placeholder character if SVG fails to load
  const drawPlaceholderCharacter = (container: Container) => {
    const graphics = new Graphics();

    // Body
    graphics.circle(0, 100, 60);
    graphics.fill({ color: 0xfef3c7 });

    // Head
    graphics.circle(0, 0, 80);
    graphics.fill({ color: 0xfef3c7 });

    // Eyes
    graphics.ellipse(-25, -10, 15, 20);
    graphics.fill({ color: 0xffffff });
    graphics.circle(-25, -5, 10);
    graphics.fill({ color: 0x6366f1 });

    graphics.ellipse(25, -10, 15, 20);
    graphics.fill({ color: 0xffffff });
    graphics.circle(25, -5, 10);
    graphics.fill({ color: 0x6366f1 });

    // Smile
    graphics.arc(0, 20, 20, 0, Math.PI, false);
    graphics.stroke({ color: 0xf472b6, width: 3 });

    container.addChildAt(graphics, 0);
  };

  // Update particles
  const updateParticles = (container: Container, delta: number) => {
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += 0.1 * delta;
      p.life -= delta;
      p.rotation += 0.1 * delta;
      return p.life > 0;
    });

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
    const itemsContainer = character?.getChildByLabel('items') as Container;
    if (!itemsContainer) return;

    // Clear previous items
    itemsContainer.removeChildren();

    // Draw applied items
    appliedItems.forEach((applied, index) => {
      const graphics = new Graphics();

      // Draw colored shapes representing items
      const categoryColors: Record<string, number> = {
        lips: 0xff6b8a,
        eyes: 0x818cf8,
        cheeks: 0xfda4af,
        hair: 0xa78bfa,
        accessories: 0xfbbf24,
        wings: 0x67e8f9,
      };

      const color = categoryColors[applied.item.category] || 0xffffff;

      // Different shapes for different categories
      switch (applied.item.category) {
        case 'lips':
          graphics.ellipse(applied.position.x, applied.position.y, 25, 10);
          break;
        case 'eyes':
          graphics.ellipse(applied.position.x - 30, applied.position.y, 20, 12);
          graphics.ellipse(applied.position.x + 30, applied.position.y, 20, 12);
          break;
        case 'cheeks':
          graphics.circle(applied.position.x - 40, applied.position.y, 15);
          graphics.circle(applied.position.x + 40, applied.position.y, 15);
          break;
        case 'hair':
          graphics.ellipse(applied.position.x, applied.position.y, 70, 40);
          break;
        case 'accessories':
          graphics.star(applied.position.x, applied.position.y, 5, 20, 10);
          break;
        case 'wings':
          graphics.ellipse(applied.position.x - 80, applied.position.y, 40, 60);
          graphics.ellipse(applied.position.x + 80, applied.position.y, 40, 60);
          break;
        default:
          graphics.circle(applied.position.x, applied.position.y, 15);
      }

      graphics.fill({ color, alpha: 0.7 });

      // Add glow effect
      const glow = new Graphics();
      if (applied.item.category === 'wings') {
        glow.ellipse(applied.position.x - 80, applied.position.y, 45, 65);
        glow.ellipse(applied.position.x + 80, applied.position.y, 45, 65);
      } else {
        glow.circle(applied.position.x, applied.position.y, 25);
      }
      glow.fill({ color, alpha: 0.2 });

      itemsContainer.addChild(glow);
      itemsContainer.addChild(graphics);

      // Spawn sparkles when item is new
      if (index === appliedItems.length - 1) {
        spawnSparkles(
          character.x + applied.position.x,
          character.y + applied.position.y,
          15
        );
      }
    });
  }, [appliedItems, isLoaded, spawnSparkles]);

  // Continuous ambient sparkles
  useEffect(() => {
    if (!appRef.current || !isLoaded) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        spawnSparkles(
          Math.random() * window.innerWidth,
          Math.random() * (window.innerHeight * 0.5),
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
