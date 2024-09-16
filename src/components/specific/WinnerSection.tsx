import { useGame } from "@/components/util/GameProvider";

export const WinnerSection = () => {
  const { winner } = useGame();

  return <h2 className="text-2xl mb-4">{winner}</h2>;
};

export default WinnerSection;
