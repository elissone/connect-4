import Ficha from "@/components/specific/Ficha";
import clsx from "clsx";
import { createRef, MutableRefObject, useEffect, useMemo, useState } from "react";
import { useMouseClick, useMousePosition } from "@/lib/utils";
import { useGame } from "@/components/util/GameProvider";

export const FichaDropPreview = () => {
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
    () => {
      setFichaRefs(
        indeces.map( (_, i) => fichaRefs[i] || createRef() )
      );
    }, [indeces]
  );

  const fichaArrayVerticalBounds = useMemo(
    () => indeces.map((i) => {
      const { left, right } = fichaRefs[i].current?.getBoundingClientRect() ?? {};
      if (!left || !right) return;
      return { left, right };
    }),
    [fichaRefs]
  );

  const mousePos = useMousePosition();

  useEffect(() => {
    if (!mousePos.x) return; 
    if (winner) {
      setCurrentIdx(-1);
      return;
    }
    const leftMost = fichaArrayVerticalBounds?.[0];
    const rigthMost = fichaArrayVerticalBounds?.[fichaArrayVerticalBounds.length - 1];
    if (!leftMost || !rigthMost) return;
    if (mousePos.x < leftMost.left || mousePos.x > rigthMost.right) setCurrentIdx(-1);

    fichaArrayVerticalBounds.find((bounds, i) => {
      if (!bounds) return false;
      if (mousePos.x && mousePos.x >= bounds.left && mousePos.x <= bounds.right) {
        setCurrentIdx(i);
        return true;
      }
    })
  }, [mousePos.x]);

  useMouseClick((_) => {
    if (currentIdx === -1 || winner || gameLostFocus) return;
      currentTurn !== null 
        ? updateBoard(currentIdx, currentTurn)
        : undefined;
      setCurrentTurn(currentTurn === 'red' ? 'yellow' : 'red');
    }
  );
  
  return (
    <div className="flex flex-auto justify-center">
      <div className="grid grid-cols-6">
        { indeces.map( 
          (i) => (
            <Ficha
              key={i}
              ref={ fichaRefs[i] ?? undefined }
              className={clsx({ 'invisible': i !== currentIdx || currentIdx === -1 || gameLostFocus})}
              type={currentTurn}
            />
          )
        )}
      </div>
    </div>
  );
};

export default FichaDropPreview;