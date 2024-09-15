import Ficha from '@/components/specific/Ficha';
import { useGame } from '@/components/util/GameProvider';

export const Board = () => {

  const { boardModel } = useGame();

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
