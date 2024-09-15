import '@/App.css'
import { Board } from '@/components/specific/Board';
import FichaDropPreview from '@/components/specific/FichaDropPreview';
import { ThemeProvider } from './components/util/ThemeProvider';
import { ThemeToggle } from './components/util/ThemeToggle';

import { GameProvider, useGame } from '@/components/util/GameProvider';
import { useState } from 'react';

export const App = () => {
  const [boardDimensions, setBoardDimensions] = useState({ row: 6, col: 6 })
  const [winLineLength, setWinLineLength] = useState(4);

  const { winner } = useGame();

  return (
    <div>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <div>
            <p> babo connect 4</p>
            <GameProvider
              boardDimensions={boardDimensions}
              winLineLength={winLineLength}
            >
              <FichaDropPreview/>
              <Board/>
              winner: {winner}
            </GameProvider>
          </div>
          <ThemeToggle className='fixed bottom-0 right-0 m-5'/>
        </ThemeProvider>
    </div>
  );
};

export default App
