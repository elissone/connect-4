import Ficha from '@/components/specific/Ficha';
import { useGameContext } from '@/App';

export const Board = () => {

  const { boardModel } = useGameContext()

  return (
    <div className='flex flex-auto justify-center mt-25'>
      { boardModel.map( (col, c) => (
        <div key={c} className='grid grid-rows-6'>
          { col.map((_row, r) => <Ficha key={`${c}-${r}`} type={boardModel[c][r]}/>) }
        </div>
      ))}
    </div>
  );
};

export default Board;
