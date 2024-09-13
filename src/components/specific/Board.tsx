import { useMemo, useState } from 'react';
import Ficha, { FichaColor } from '@/components/specific/Ficha';

type FichaID = [number, number]

interface BoardProps { boardDimensions: { row: number, col: number }; }

export const Board = ({ boardDimensions }: BoardProps) => {

  const [board, setBoard] = useState<Map<FichaID, FichaColor>>(
    new Map<FichaID, FichaColor>()
  );

  const indeces = useMemo(
    () => {
      setBoard(new Map<FichaID, FichaColor>())
      return {
        row: Array.from({length: boardDimensions.row}).map((_, i) => i),
        col: Array.from({length: boardDimensions.col}).map((_, i) => i),
      };
    },
    [boardDimensions]
  );

  return (
    <div className='flex flex-auto justify-center mt-25'>
      { indeces.row.map( (i) => (
        <div key={i} className='grid grid-rows-6'>
          { indeces.col.map((j) => <Ficha key={`${i}-${j}`} type={board.get([i, j]) ?? null}/>) }
        </div>
      ))}
    </div>
  );
};

export default Board;
