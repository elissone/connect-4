import { useGame } from "@/components/util/GameProvider";
import { useSettings } from "@/components/util/SettingsProvider";
import { useMemo } from "react";
import { Ficha, FichaColor } from "@/components/specific/Ficha";

const WinnerSection = ({ winner }: { winner: FichaColor }) => (
  <div className="flex items-center gap-3">
    <Ficha type={winner} size="min(7vw, 2vh)" />
    <h2 className="leading-none select-none" style={{ fontSize: 'min(7vw, 2vh)' }}>{winner} wins!</h2>
  </div>
);

const ControlsSection = () => {
  return (
    <div className="flex items-center">
      <p>This is the controls section</p>
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
      { showControls && <ControlsSection/> }
    </div>
  );
};

export default GameStats;
