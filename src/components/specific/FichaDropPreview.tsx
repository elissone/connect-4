import Ficha from "@/components/specific/Ficha";
import clsx from "clsx";
import { useMemo, MouseEventHandler } from "react";
import { useGame } from "@/components/util/GameProvider";

interface FichaDropPreviewProps {
  className?: string;
  fichaSize: number ;
}

export const FichaDropPreview = ({ fichaSize, className = '' }: FichaDropPreviewProps) => {
  const { winner, boardModel, updateBoard, currentTurn, setCurrentTurn, gameLostFocus }
    = useGame();

  const indeces = useMemo(
    () => Array.from({length: boardModel.length}).map((_, i) => i),
    [boardModel]
  );

  const handleClick = (i: number): MouseEventHandler<HTMLDivElement> =>
    (e) => {
      console.log(i);
      e.preventDefault();
      if (winner || gameLostFocus) return;
      if (currentTurn !== null) updateBoard(i, currentTurn);
      setCurrentTurn(currentTurn === 'red' ? 'yellow' : 'red');
    };
  
  return (
    <div
      className={clsx({
        [className]: className !== '',
        ['grid grid-flow-col border-2 rounded-2xl']: true,
        ['border-stone-800 hover:border-stone-500']: true
      })}
    >
      { indeces.map( 
        (i) => (
          <Ficha
            key={i}
            size={ fichaSize }
            onClick={ handleClick(i) }
            className={clsx({
              'opacity-0': true,
              'hover:opacity-100': !gameLostFocus
            })}
            type={currentTurn}
          />
        )
      )}
    </div>
  );
};

export default FichaDropPreview;