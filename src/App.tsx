import '@/App.css'
import { Board } from '@/components/specific/Board';
import GameStats from '@/components/specific/GameStats';
import { SettingsProvider } from '@/components/util/SettingsProvider';
import { GameProvider } from '@/components/util/GameProvider';
import { useRef } from 'react';
import BottomRightTools from '@/components/specific/BottomRightTools';

export const App = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className='h-[90vh] w-[90vw] m-auto flex items-center justify-center flex-col'>
      <SettingsProvider storageKey='vite-ui-theme'>
        <GameProvider>
          <div className='h-[10%] w-full flex items-center justify-center'>
            <h1
              className='font-[700] text-primary italic whitespace-nowrap'
              style={{
                fontSize: 'clamp(1px, min(10vw, 5vh), 3.75rem)',
                lineHeight: '1'
              }}>
              Connect Babo
            </h1>
          </div>
          <div ref={containerRef} className='h-[90%] w-full flex flex-col gap-5 items-center'>
            <Board className='' containerRef={containerRef}/>
            <GameStats/>
          </div>
          <BottomRightTools/>
        </GameProvider>
      </SettingsProvider>
    </div>
  );
}

export default App
