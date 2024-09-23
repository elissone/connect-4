import '@/App.css'
import { Board } from '@/components/specific/Board';
import WinnerSection from '@/components/specific/WinnerSection';
import { SettingsProvider } from '@/components/util/SettingsProvider';
import Settings from '@/components/specific/Settings';
import { Card } from '@/components/ui/card';

import { GameProvider } from '@/components/util/GameProvider';

export const App = () => (
  <div className='flex flex-col'>
    <SettingsProvider storageKey='vite-ui-theme'>
      <GameProvider>
        <div className='text-6xl font-[700] italic mt-5 mb-20'>Connect Babo</div>
        <Card className='h-[70vh]'>
          <Board/>
        </Card>
        <WinnerSection/>
        <Settings/>
      </GameProvider>
    </SettingsProvider>
  </div>
);

export default App
