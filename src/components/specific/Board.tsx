import Ficha from '@/components/specific/Ficha';
import { useGameContext } from '@/App';

export const Board = () => {

  const gameContext = useGameContext()

  return (
    <div className='flex flex-auto justify-center mt-25'>
      { gameContext.boardModel.map( (r, i) => (
        <div key={i} className='grid grid-rows-6'>
          { r.map((_, j) => <Ficha key={`${i}-${j}`} type={gameContext.boardModel[j][i]}/>) }
        </div>
      ))}
    </div>
  );
};

export default Board;
