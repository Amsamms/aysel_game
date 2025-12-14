import { GameProvider, useGame } from './contexts/GameContext';
import { MainMenu } from './components/ui/MainMenu';
import { LevelSelect } from './components/ui/LevelSelect';
import { CollectionBook } from './components/ui/CollectionBook';
import { ResultScreen } from './components/ui/ResultScreen';
import { GameCanvas } from './components/game/GameCanvas';

// Screen router component
function GameScreens() {
  const { state } = useGame();

  switch (state.screen) {
    case 'menu':
      return <MainMenu />;
    case 'levelSelect':
      return <LevelSelect />;
    case 'collection':
      return <CollectionBook />;
    case 'game':
      return <GameCanvas />;
    case 'result':
      return <ResultScreen />;
    default:
      return <MainMenu />;
  }
}

// Loading screen
function LoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900">
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-4">✨</div>
        <h1 className="text-2xl font-bold text-pink-200 mb-2">
          Enchanted Glamour Kingdom
        </h1>
        <p className="text-purple-300">Loading magic...</p>
      </div>
    </div>
  );
}

// Main app wrapper
function GameApp() {
  const { state } = useGame();

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return <GameScreens />;
}

function App() {
  return (
    <GameProvider>
      <div className="w-screen h-screen overflow-hidden">
        <GameApp />
      </div>
    </GameProvider>
  );
}

export default App;
