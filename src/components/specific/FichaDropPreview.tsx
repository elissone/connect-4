import Ficha from "@/components/specific/Ficha";
import clsx from "clsx";
import { MouseEvent, useState, useMemo, useEffect, useRef } from "react";
import { useGame } from "@/components/util/GameProvider";
import { useSettings } from "@/components/util/SettingsProvider";
import { useIsResizing, useKeyboardDown } from "@/lib/utils";

interface FichaDropPreviewProps {
  className?: string;
  fichaSize: number ;
}

export const FichaDropPreview = ({ fichaSize, className = '' }: FichaDropPreviewProps) => {
  const { 
    winner,
    boardModel,
    updateBoard,
    currentTurn,
    gameLostFocus,
    justDroppedCol,
    useMouse,
    setUseMouse
  } = useGame();
  const { boardDimensions } = useSettings();

  const placeFicha = () => {
    if (winner || gameLostFocus || justDroppedCol >= 0) return;
    if (currentTurn !== null) updateBoard(currentIdx, currentTurn);
  };
  
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    placeFicha();
  };

  const handleEnter = () => {
    if (useMouse) return;
    if (useMouseTimer.current) clearTimeout(useMouseTimer.current);
    useMouseTimer.current = setTimeout(() => [setUseMouse(true), setShowFicha(false)], 2000);
    placeFicha();
  };
  
  const [fichaMargin, setFichaMargin] = useState(0);
  const [showFicha, setShowFicha] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const shouldFichaShowAndMouseMode = (mouseOver: boolean) => {
    setUseMouse(!mouseOver);
    setShowFicha(mouseOver);
  };

  const updateIdxAndMarginByNewIdx = (newIdx: number) => {
    setCurrentIdx(newIdx);
    const cappedIdx = Math.min(newIdx, boardDimensions.col - 2);
    setFichaMargin(cappedIdx * (fichaSize + 8) + (
      newIdx == boardDimensions.col - 1
        ? fichaSize + 4
        : 0
    ));
  };

  const useMouseTimer = useRef<Timer | null>(null);

  const timeOutLogic = () => {
    // Turn off mouuse mode after 3 seconds
    // Clear the timer if it exists
    if (useMouseTimer.current) clearTimeout(useMouseTimer.current);
    useMouseTimer.current = setTimeout(() => [setUseMouse(true), setShowFicha(false)], 2000);
  }
  
  useEffect(() => {
    updateIdxAndMarginByNewIdx(Math.min(boardDimensions.col - 1, currentIdx));
  }, [boardDimensions, fichaSize]);

  const handleMoveFicha = (direction: 'left' | 'right') => {
    setUseMouse(false);
    setShowFicha(true);
    timeOutLogic();
    let newIdx = currentIdx;
    switch (direction) {
      case 'left':
        if (currentIdx === 0) return;
        newIdx = currentIdx - 1;
        break;
      case 'right':
        if (currentIdx === boardDimensions.col - 1) return;
        newIdx = currentIdx + 1;
        break;
    }
    updateIdxAndMarginByNewIdx(newIdx);
  }

  useKeyboardDown({
    'ArrowUp': () => [setUseMouse(false), setShowFicha(true), timeOutLogic()],
    'w': () => [setUseMouse(false), setShowFicha(true), timeOutLogic()],
    'ArrowLeft': () => handleMoveFicha('left'),
    'ArrowRight': () => handleMoveFicha('right'),
    'a': () => handleMoveFicha('left'),
    'd': () => handleMoveFicha('right'),
    'ArrowDown': handleEnter,
    'Enter': handleEnter,
    ' ': handleEnter,
    's': handleEnter
  });

  // gap is 8 px
  const mouseOverFichasHandler = (e: MouseEvent) => {
    // things are devided by blocks the size of the fichas + the gapsize
    const mousePos = e.clientX - e.currentTarget.getBoundingClientRect().left;
    // account for the first and last items since they are special
    let pos = 0;
    const currentDivWidth = e.currentTarget.getBoundingClientRect().width;
    if (mousePos < 0 || mousePos > currentDivWidth) return;
    if (mousePos > currentDivWidth - fichaSize) {
      // - 4px to account for the border
      pos = currentDivWidth - fichaSize - 4;
    } else {
      const idx = Math.floor(mousePos / (fichaSize + 8));
      pos = idx * (fichaSize + 8);
    }
    setFichaMargin(pos);
    setCurrentIdx(
      fichaMargin === (currentDivWidth - fichaSize - 4)
        ? boardDimensions.col - 1
        : Math.floor(fichaMargin / (fichaSize + 8))
    )
  };

  const isResizing = useIsResizing();

  const fichaOpacity = useMemo(
    () => (showFicha && justDroppedCol < 0) ? 1 : 0,
    [showFicha, justDroppedCol]
  );
  
  return (
    <div
      style={{
        transition: 'border-color 0.2s ease',
        width: (fichaSize * boardModel.length) + 8 * (boardModel.length - 1)
      }}
      className={clsx({
        [className]: className !== '',
        ['grid grid-flow-col border-2 rounded-2xl cursor-none']: true,
        ['border-stone-800']: useMouse,
        ['border-stone-500']: !useMouse,
        ['hover:border-stone-500']: true,
      })}
      onMouseMove={ mouseOverFichasHandler }
      onClick={ handleClick }
      onMouseEnter={ () => shouldFichaShowAndMouseMode(true) }
      onMouseLeave={ () => shouldFichaShowAndMouseMode(false) }
    >
      <Ficha
        style={{
          marginLeft: fichaMargin,
          marginRight: 'auto',
          opacity: fichaOpacity,
          // Do not animate the ficha moving around (its margin) when resizing
          transition: `${!isResizing ? 'margin 0.2s ease, ' : ''}opacity 0.2s ease, background-color 0.1s ease`,
        }}
        size={ fichaSize }
        type={currentTurn}
      />
    </div>
  );
};

export default FichaDropPreview;