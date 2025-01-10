import Ficha from '@/components/specific/Ficha';
import FichaDropPreview from '@/components/specific/FichaDropPreview';
import { useGame } from '@/components/util/GameProvider';
import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '@/components/util/SettingsProvider';

type BoardProps = { className: string; containerRef: React.RefObject<HTMLDivElement | null> };

export const Board = ({ className, containerRef }: BoardProps) => {

  const { boardModel, justDroppedCol, currentTurn, nextAvailableSlot } = useGame();
  const { boardDimensions, fichaSize, setFichaSize } = useSettings();
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

  useEffect(
    () => setFichaSize(
      Math.min(
        // Width-Based
        // cw - fichaGap / cols
        (containerWidth - (8 * (boardDimensions.col - 1))) / boardDimensions.col,
        // Height-Based
        // (ch - fichaGap - topAndBottomGaps - PreviewBorder) / (rows + preview ficha)
        ((containerHeight * 0.9) - (8 * (boardDimensions.row - 1)) - 40 - 4) / (boardDimensions.row + 1)
      )
    ),
    [containerWidth, containerHeight, boardDimensions]
  );

  const getPaddingForFichaGrid = (c: number, r: number) => {
    let [top, rgt, btm, lft] = [4, 4, 4, 4];

    if (c == 0) lft = 0;
    if (c == boardDimensions.col - 1) rgt = 0;
    if (r == 0) top = 0;
    if (r == boardDimensions.row - 1) btm = 0;

    const result = `${top}px ${rgt}px ${btm}px ${lft}px`;
    return result;
  }

  // Animate the first pop-out of the ficha
  const [fichaHideTop, setFichaTop] = useState(-fichaSize);
  useEffect(() => {
    // Delay the animation slightly to allow for a smooth initial render
    if (justDroppedCol !== -1) {
      setTimeout(() => setFichaTop(0), 50); // Small delay to allow initial render
    } else {
      setFichaTop(-fichaSize);
    }
  }, [justDroppedCol, fichaSize]);

  // For the positioning of the ficha depending on where it was dropped
  const fichaLeft = useMemo(
    () => justDroppedCol < 0 ? 0 : (fichaSize + 8) * justDroppedCol,
    [justDroppedCol, fichaSize]
  );

  // For the moving dropping animation
  const fichaTop = useMemo(
    () => justDroppedCol >= 0
      ? nextAvailableSlot[justDroppedCol] * (fichaSize + 8)
      : 0,
    [justDroppedCol, nextAvailableSlot, fichaSize]
  );

  return (
    <div className={ `${className} w-full h-fit flex flex-col gap-5 items-center` }>
      <FichaDropPreview fichaSize={ fichaSize }  className='size-fit'/>
      <div className='relative size-fit z-0'>
        <div 
          className='absolute inset-0 -z-10 overflow-clip'
          style={{
            transition: 'top 0.2s ease 0.15s',
            top: `${fichaTop}px`,
            opacity: justDroppedCol < 0 ? 0 : 1,
          }}
        >
          <Ficha
            type={ currentTurn }
            size={ fichaSize }
            style={{
              position: 'absolute',
              transition: 'top 0.1s ease',
              left: `${fichaLeft}px`,
              top: `${fichaHideTop}px`,
            }}
          />
        </div>
        <div className='grid grid-flow-col z-1'>
          { boardModel.map( (col, c) => (
            <div key={c} className='size-fit grid grid-flow-rows'>
              {col.map((_row, r) =>
                // Make the outline clip in a parent div.
                // Immitate 'gap-2' by dynamically setting the padding based off of the
                // location of the column the ficha is in 
                <div 
                  key={`${c}-${r}`}
                  style={{ overflow: 'clip', padding: getPaddingForFichaGrid(c, r) }}
                >
                  <Ficha
                    // Make a big outline that covers up a whole square. It will be clipped in a parent
                    className='outline outline-[100px] outline-background'
                    size={ fichaSize }
                    border
                    type={boardModel[c][r]}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
