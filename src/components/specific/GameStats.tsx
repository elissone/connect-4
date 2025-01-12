import { useGame } from "@/components/util/GameProvider";
import { useSettings } from "@/components/util/SettingsProvider";
import { useMemo, useState, useRef, useEffect } from "react";
import { Ficha, FichaColor } from "@/components/specific/Ficha";
import { ArrowDown, ArrowLeft, ArrowRight, Space, CornerDownLeft as Enter } from "lucide-react";

const WinnerSection = ({ winner }: { winner: FichaColor }) => (
  <div className="flex items-center gap-3">
    <Ficha type={winner} size="min(7vw, 2vh)" />
    <h2 className="leading-none select-none" style={{ fontSize: 'min(7vw, 2vh)' }}>{winner} wins!</h2>
  </div>
);

const ControlsSection = ({ showControls }: { showControls: boolean }) => {
  const fontSizeVal = 'min(4vw, 1.5vh)';
  const controlsClasses = 'mx-1 text-stone-300 bg-stone-700 rounded-md px-1';

  const [controlOpacity, setControlOpacity] = useState(0);
  const controlOpacityTimeout = useRef<Timer | null>(null);

  useEffect(() => {
    setControlOpacity(1);
    if (controlOpacityTimeout.current) clearTimeout(controlOpacityTimeout.current);
    controlOpacityTimeout.current = setTimeout(() => setControlOpacity(0), 2000);
  }, [showControls]);

  return (
    <div 
      className="select-none flex items-center flex-col"
      style={{
        gap: 'min(1vw, 0.5vh)',
        fontSize: fontSizeVal,
        opacity: controlOpacity,
        transition: 'opacity 0.5s ease-in-out',
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

export const GameStats = () => {
  const { winner } = useGame();
  const { fichaSize, boardDimensions, showControls } = useSettings();

  const width = useMemo(
    () => ((fichaSize + 8) * boardDimensions.col) - 8,
    [fichaSize, boardDimensions]
  );

  const showContent = useMemo(
    () => Boolean(winner) || showControls,
    [winner, showControls]
  );

  return (
    <div
      className="rounded-2xl border-stone-500 h-[10%] flex flex-col items-center justify-center"
      style={{
        width: `${width}px`,
        borderWidth: winner ? '2px' : '0',
        opacity: showContent ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      { winner && <WinnerSection winner={winner}/> }
      { showControls && <ControlsSection showControls={showControls}/> }
    </div>
  );
};

export default GameStats;
