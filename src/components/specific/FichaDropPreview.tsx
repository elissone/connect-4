import Ficha from "@/components/specific/Ficha";
import clsx from "clsx";
import { MouseEvent, useState, useMemo } from "react";
import { useGame } from "@/components/util/GameProvider";

interface FichaDropPreviewProps {
  className?: string;
  fichaSize: number ;
}

export const FichaDropPreview = ({ fichaSize, className = '' }: FichaDropPreviewProps) => {
  const { winner, boardModel, updateBoard, currentTurn, gameLostFocus }
    = useGame();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (winner || gameLostFocus) return;
    if (currentTurn !== null) updateBoard(currentIdx, currentTurn);
  };
  
  const [fichaMargin, setFichaMargin] = useState(0);
  const [currentDivWidth, setcurrentDivWidth] = useState(0);
  const [showFicha, setShowFicha] = useState(false);
  const currentIdx = useMemo(
    () => {
      return fichaMargin === (currentDivWidth - fichaSize - 4)
        ? boardModel[0].length - 1
        : Math.floor(fichaMargin / (fichaSize + 8))
      },
    [fichaMargin]
  );
  
  // gap is 8 px
  const mouseOverFichasHandler = (e: MouseEvent) => {
    // things are devided by blocks the size of the fichas + the gapsize
    const mousePos = e.clientX - e.currentTarget.getBoundingClientRect().left;
    setcurrentDivWidth(e.currentTarget.getBoundingClientRect().width);
    // account for the first and last items since they are special
    let pos = 0;
    if (mousePos < 0 || mousePos > currentDivWidth) return;
    if (mousePos > currentDivWidth - fichaSize) {
      // - 4px to account for the border
      pos = currentDivWidth - fichaSize - 4;
    } else {
      const idx = Math.floor(mousePos / (fichaSize + 8));
      pos = idx * (fichaSize + 8);
    }
    setFichaMargin(pos);
  };
  
  return (
    <div
      style={{
        transition: 'border-color 0.2s ease',
        width: (fichaSize * boardModel.length) + 8 * (boardModel.length - 1)
      }}
      className={clsx({
        [className]: className !== '',
        ['grid grid-flow-col border-2 rounded-2xl cursor-none']: true,
        ['border-stone-800 hover:border-stone-500']: true
      })}
      onMouseMove={ mouseOverFichasHandler }
      onClick={ handleClick }
      onMouseEnter={ () => setShowFicha(true) }
      onMouseLeave={ () => setShowFicha(false) }
    >
      <Ficha
        style={{
          marginLeft: fichaMargin,
          marginRight: 'auto',
          opacity: showFicha ? 1 : 0,
          transition: 'margin 0.2s ease, opacity 0.2s ease, background-color 0.1s ease',
        }}
        size={ fichaSize }
        type={currentTurn}
      />
    </div>
  );
};

export default FichaDropPreview;