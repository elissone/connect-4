import '@/App.css'
import { Board } from '@/components/specific/Board';
import WinnerSection from '@/components/specific/WinnerSection';
import { SettingsProvider } from '@/components/util/SettingsProvider';
import Settings from '@/components/specific/Settings';
import { Card } from '@/components/ui/card';

import { GameProvider } from '@/components/util/GameProvider';

export const App = () => (
  <div>
    <SettingsProvider storageKey='vite-ui-theme'>
      <div className='text-6xl font-[700] italic mt-5 mb-20'>Connect Babo</div>
      <GameProvider>
        <Card className='size-fit'>
          <Board className='mx-20'/>
          <WinnerSection/>
        </Card>
        <Settings/>
      </GameProvider>
    </SettingsProvider>
  </div>
);

export default App
