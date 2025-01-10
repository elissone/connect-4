import '@/App.css'
import { Board } from '@/components/specific/Board';
import WinnerSection from '@/components/specific/WinnerSection';
import { SettingsProvider } from '@/components/util/SettingsProvider';
import Settings from '@/components/specific/Settings';

import { GameProvider } from '@/components/util/GameProvider';
import { useRef } from 'react';

export const App = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
  <div className='h-full w-[90vw] m-auto flex flex-col items-center'>
    <SettingsProvider storageKey='vite-ui-theme'>
      <GameProvider>
        <div className='h-[10%] w-full flex items-center justify-center'>
          <h1 
            className='transition-[font-size] duration-300 font-[700] text-primary italic whitespace-nowrap'
            style={{
              fontSize: 'clamp(1px, min(7vw, 7vh), 3.75rem)',
              lineHeight: '1'
            }}>
            Connect Babo
          </h1>
        </div>
        <div ref={containerRef} className='h-[90%] w-full flex flex-col gap-5 items-center'>
          <Board className='' containerRef={containerRef}/>
          <WinnerSection/>
        </div>
        <Settings/>
        </GameProvider>
      </SettingsProvider>
    </div>
  );
}

export default App
