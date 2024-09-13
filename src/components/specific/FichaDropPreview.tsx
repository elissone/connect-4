import Ficha, { FichaColor } from "@/components/specific/Ficha";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMousePosition } from "@/lib/utils";

interface FichaDropPreviewProps {
  columnSize: number;
  currentTurn: FichaColor;
}

export const FichaDropPreview = ({ columnSize, currentTurn }: FichaDropPreviewProps) => {

  const indeces = Array.from({length: columnSize}).map((_, i) => i);

  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const fichaRefs = indeces.map(() => useRef<HTMLDivElement>(null));

  const fichaArrayVerticalBounds = useMemo(
    () => fichaRefs.map((ref) => {
      const { left, right } = ref?.current?.getBoundingClientRect() ?? {};
      if (!left || !right) return;
      return { left, right };
    }),
    [indeces]
  );

  const mousePos = useMousePosition();

  useEffect(() => {
    if (!mousePos.x) return; 
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
  
  return (
    <div className="flex flex-auto justify-center">
      <div className="grid grid-cols-6">
        { indeces.map( 
          (i) => <Ficha
            refVal={fichaRefs[i]}
            className={clsx({
              'invisible': i !== currentIdx || currentIdx === -1
            })}
            key={i}
            type={currentTurn}
          />
        )}
      </div>
    </div>
  );
};

export default FichaDropPreview;