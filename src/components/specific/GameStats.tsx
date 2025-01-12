import { useGame } from "@/components/util/GameProvider";
import { useSettings } from "@/components/util/SettingsProvider";
import { useMemo } from "react";
import { Ficha } from "./Ficha";

export const GameStats = () => {
  const { winner } = useGame();
  const { fichaSize, boardDimensions } = useSettings();

  const width = useMemo(
    () => ((fichaSize + 8) * boardDimensions.col) - 8,
    [fichaSize, boardDimensions]
  );

  return (
    <div
      className="border-2 rounded-2xl border-stone-500 h-[10%] flex flex-col items-center justify-center"
      style={{
        width: `${width}px`,
        opacity: winner ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <div className="flex items-center gap-3">
        <Ficha type={winner} size="min(7vw, 2vh)" />
        <h2
          className="leading-none select-none"
          style={{ fontSize: 'min(7vw, 2vh)' }}
        >{winner} wins!</h2>
      </div>
    </div>
  );
};

export default GameStats;
