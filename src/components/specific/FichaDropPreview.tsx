import Ficha from "@/components/specific/Ficha";
import clsx from "clsx";
import {
  createRef,
  MutableRefObject,
  useEffect,
  useMemo,
  useState,
  MouseEventHandler
} from "react";
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

  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [fichaRefs, setFichaRefs] = useState<MutableRefObject<HTMLDivElement | null>[]>(
    indeces.map(() => createRef())
  );

  useEffect(
    () => setFichaRefs(
      indeces.map( (_, i) => fichaRefs[i] || createRef() )
    ), [indeces]
  );

  const fichaArrayVerticalBounds = useMemo(
    () => indeces.map((i) => {
      const { left, right } = fichaRefs[i].current?.getBoundingClientRect() ?? {};
      if (!left || !right) return;
      return { left, right };
    }),
    [fichaRefs]
  );

  const onClick: MouseEventHandler<HTMLDivElement> = (_) => {
  if (currentIdx === -1 || winner || gameLostFocus) return;
    currentTurn !== null 
      ? updateBoard(currentIdx, currentTurn)
      : undefined;
    setCurrentTurn(currentTurn === 'red' ? 'yellow' : 'red');
  };

  const mouseEvents: {
    in: MouseEventHandler<HTMLDivElement>,
    out: MouseEventHandler<HTMLDivElement>
  } = {
    out: (_) => setCurrentIdx(-1),
    in: ({ pageX }) => {
      if (!pageX) return; 
      if (winner) {
        setCurrentIdx(-1);
        return;
      }
      const leftMost = fichaArrayVerticalBounds?.[0];
      const rigthMost = fichaArrayVerticalBounds?.[fichaArrayVerticalBounds.length - 1];
      if (!leftMost || !rigthMost) return;
      if (pageX < leftMost.left || pageX > rigthMost.right) setCurrentIdx(-1);

      fichaArrayVerticalBounds.find((bounds, i) => {
        if (!bounds) return false;
        if (pageX && pageX >= bounds.left && pageX <= bounds.right) {
          setCurrentIdx(i);
          return true;
        }
      })
    }
  };
  
  return (
    <div
      onClick={ onClick }
      onMouseOut={mouseEvents.out }
      onMouseMove={ mouseEvents.in }
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
            ref={ fichaRefs[i] ?? undefined }
            className={clsx({ 'invisible': i !== currentIdx || currentIdx === -1 || gameLostFocus})}
            type={currentTurn}
          />
        )
      )}
    </div>
  );
};

export default FichaDropPreview;