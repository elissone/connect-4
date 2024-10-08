import Ficha from '@/components/specific/Ficha';
import FichaDropPreview from '@/components/specific/FichaDropPreview';
import { useGame } from '@/components/util/GameProvider';
import { useEffect, useMemo, useRef, useState } from 'react';

export const Board = () => {

  const { boardModel } = useGame();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(
    () => {
      const obs = new ResizeObserver((entries) => {
        if (entries[0]) {
          setContainerWidth(entries[0].contentRect.width);
          setContainerHeight(entries[0].contentRect.height);
        }
      });

      if (containerRef.current) obs.observe(containerRef.current);
      // Cleanup the observer when the component unmounts
      return () => (containerRef.current) ? obs.unobserve(containerRef.current) : undefined
    }, 
    [containerRef]
  ); 

  const fichaSize = useMemo(
    () => Math.min(
      containerWidth / boardModel.length,
      ((containerHeight - 40) / (boardModel[0].length + 1))
    ) - 8,
    [containerWidth, containerHeight, boardModel]
  );

  return (
    <div
      ref={ containerRef }
      className='w-3/4 h-2/3 m-auto grid grid-flow-row'
    >
      <FichaDropPreview fichaSize={ fichaSize }  className='size-fit mx-auto gap-2 my-auto'/>
      <div className='size-fit grid grid-flow-col mx-auto mb-auto gap-2'>
        { boardModel.map( (col, c) => (
          <div key={c} className='size-fit gap-2 grid grid-flow-rows'>
            {col.map((_row, r) =>
              <Ficha
                size={ fichaSize }
                key={`${c}-${r}`}
                border
                type={boardModel[c][r]}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
