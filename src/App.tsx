import '@/App.css'
import { Board } from '@/components/specific/Board';
import FichaDropPreview from '@/components/specific/FichaDropPreview';
import WinnerSection from '@/components/specific/WinnerSection';
import { ThemeProvider } from './components/util/ThemeProvider';
import { ThemeToggle } from './components/util/ThemeToggle';
import { Card } from '@/components/ui/Card';

import { GameProvider } from '@/components/util/GameProvider';
import { useState } from 'react';

export const App = () => {
  const [boardDimensions, _setBoardDimensions] = useState({ row: 6, col: 6 })
  const [winLineLength, _setWinLineLength] = useState(4);

  return (
    <div>
      <ThemeProvider storageKey='vite-ui-theme'>
        <div className='text-4xl mt-5 mb-20'> babo connect 4</div>
        <Card>
          <GameProvider
            boardDimensions={boardDimensions}
            winLineLength={winLineLength}
          >
            <FichaDropPreview/>
            <Board className='mx-20 mb-20'/>
            <WinnerSection/>
          </GameProvider>
        </Card>
        <ThemeToggle className='fixed bottom-0 right-0 m-5'/>
      </ThemeProvider>
    </div>
  );
};

export default App
