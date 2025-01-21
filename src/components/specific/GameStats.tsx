import { useGame } from "@/components/util/GameProvider";
import { useSettings } from "@/components/util/SettingsProvider";
import { useMemo } from "react";
import { Ficha, FichaColor } from "@/components/specific/Ficha";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CornerDownLeft as Enter,
  RefreshCcw,
  Space,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDelayedBoolState } from "@/lib/utils";

const WinnerSection: React.FC<{ style: React.CSSProperties, winner: FichaColor, resetGame: () => void }> = (props) => {
  const { style, winner, resetGame } = props;
  return (
    <div 
      className="size-full opacity-0 rounded-2xl border-stone-500 flex flex-col items-center justify-center"
      style={{
        borderWidth: winner ? '2px' : '0',
        transition: 'opacity 0.5s ease-in-out',
        ...style,
      }}
    >
      <div className="flex items-center gap-3">
        <Ficha type={winner} size="min(7vw, 2vh)" />
        <h2 className="leading-none select-none" style={{ fontSize: 'min(7vw, 2vh)' }}>{winner} wins!</h2>
        <Button 
          onClick={resetGame} 
          variant='outline'
          size='icon'
          style={{ height: 'min(7vw, 2vh)', width: 'min(7vw, 2vh)' }}
        >
          <RefreshCcw className="aspect-square" style={{ height: 'min(5vw, 1.3vh)' }}/>
        </Button>
      </div>
    </div>
  );
};

const ControlsSection: React.FC<{ style: React.CSSProperties }> = (props) => {
  const { style } = props;
  const fontSizeVal = 'min(4vw, 1.5vh)';
  const controlsClasses = 'mx-1 text-stone-300 bg-stone-700 rounded-md px-1';

  return (
    <div 
      className="select-none flex items-center flex-col"
      style={{
        gap: 'min(1vw, 0.5vh)',
        fontSize: fontSizeVal,
        transition: 'opacity 0.5s ease-in-out',
        ...style,
      }}>
      <div>
        <span className={controlsClasses}>
          <ArrowLeft  className="w-fit inline aspect-square" style={{ height: fontSizeVal }}/>,
          <ArrowRight className="w-fit inline aspect-square" style={{ height: fontSizeVal }}/>,
          A, D, 
        </span>
        or
        <span className={controlsClasses}>
          Mouse Hover
        </span>
        over board to move the <span className="text-stone-300 italic">Ficha</span>
      </div>
      <div>
        <span className={controlsClasses}>
          <Enter className="w-fit inline aspect-square" style={{ height: fontSizeVal }}/>,
          <Space className="w-fit inline aspect-square" style={{ height: fontSizeVal }}/>,
          <ArrowDown className="w-fit inline aspect-square" style={{ height: fontSizeVal }}/>,
          S
        </span>
        to set it
      </div>
    </div>
  )
}

export const GameStats: React.FC = () => {
  const { winner, resetGame } = useGame();
  const { fichaSize, boardDimensions, showControls } = useSettings();

  const width = useMemo(
    () => ((fichaSize + 8) * boardDimensions.col) - 8,
    [fichaSize, boardDimensions]
  );

  /* Delay show controlls out to include animations */ 
  const _showControlsDelayedOut = useDelayedBoolState(showControls, {in: 0, out: 1050});
  const showControlsDelayedOut = useMemo(() => !winner && _showControlsDelayedOut, [winner, _showControlsDelayedOut]);
  /* Delay show controlls in to make sure opacity starts at 0 */
  const showControlsDelayedIn = useDelayedBoolState(showControls, {in: 50, out: 0});

  /* Delay show winner in to make sure opacity starts at 0 */
  const winnerDelayedIn = useDelayedBoolState(
    useMemo(() => winner !== null, [winner]), 
    { in: 50 }
  );

  return (
    <div
      className="h-[10%] flex flex-col items-center justify-center"
      style={{ width: `${width}px` }}
    >
      { winner && <WinnerSection style={{ opacity: winnerDelayedIn ? 1 : 0 }} winner={winner} resetGame={resetGame}/> }
      { showControlsDelayedOut && <ControlsSection style={{ opacity: showControlsDelayedIn ? 1 : 0 }}/> }
    </div>
  );
};

export default GameStats;
