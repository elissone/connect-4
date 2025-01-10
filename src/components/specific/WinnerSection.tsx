import { useGame } from "@/components/util/GameProvider";
import { useSettings } from "@/components/util/SettingsProvider";
import { useMemo } from "react";

export const WinnerSection = () => {
  const { winner } = useGame();
  const { fichaSize, boardDimensions } = useSettings();

  const width = useMemo(
    () => ((fichaSize + 8) * boardDimensions.col) - 8,
    [fichaSize, boardDimensions]
  );

  return (
    <div
      className="border-2 rounded-2xl border-stone-500 h-[10%]"
      style={{
        width: `${width}px`
      }}
    >
      <h2 className="text-2xl mb-4">{winner}</h2>
    </div>
  );
};

export default WinnerSection;
