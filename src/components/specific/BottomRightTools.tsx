import { Info, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import Settings from "@/components/specific/Settings";
import { useSettings } from "@/components/util/SettingsProvider";
import { useGame } from "@/components/util/GameProvider";

export const BottomRightTools = () => {

  // Use this logic to briefly show the controls tooltip
  const { setShowControls } = useSettings();
  const { resetGame } = useGame();
  const showControlsTimeout = useRef<Timer | null>(null);
  const showAndThenHideControls = () => {
    setShowControls(true);
    if (showControlsTimeout.current) clearTimeout(showControlsTimeout.current);
    showControlsTimeout.current = setTimeout(() => setShowControls(false), 2500);
  }

  return (
    <div className='fixed bottom-0 right-0 m-5 flex gap-1'>
      <Button variant='outline' size='icon' onClick={ resetGame }>
        <RefreshCcw className='h-[1.2rem] w-[1.2rem] scale-100'/>
      </Button>
      <Button variant='outline' size='icon' onClick={ showAndThenHideControls }>
        <Info className='h-[1.2rem] w-[1.2rem] scale-100'/>
      </Button>
      <Settings/>
    </div>
  );
}

export default BottomRightTools;