import '@/App.css'
import { Board } from '@/components/specific/Board';
import FichaDropPreview from '@/components/specific/FichaDropPreview';
import { FichaColor } from '@/components/specific/Ficha';
import { createContext, useContext, useState } from 'react';

interface GameContextValues {
   currentTurn: FichaColor;
   setCurrentTurn: (turn: FichaColor) => void;
   boardModel: FichaColor[][]
   updateBoard: (col: number, turn: Exclude<FichaColor, null>) => void
}

export const GameContext = createContext<GameContextValues>({
  currentTurn: null,
  setCurrentTurn: () => {},
  boardModel: Array(6).map(() => Array(6).fill(null)),
  updateBoard: () => {}
});
export const useGameContext = () => useContext(GameContext);

export const App = () => {
  const boardDimensions = { row: 6, col: 6 }

  const [currentTurn, setCurrentTurn] = useState<FichaColor>('red');
  const [boardModel, setBoardModel] = useState<GameContextValues['boardModel']>(
    new Array(boardDimensions.row).fill(null).map(() => Array(boardDimensions.col).fill(null))
  );
  const [nextAvailableSlot, setNextAvailableSlot] = useState<number[]>(boardModel[0].map((_) => boardDimensions.row - 1));

  const updateBoard: GameContextValues['updateBoard'] = (col: number, turn: Exclude<FichaColor, null>) => {
    console.log('klokentoki');
    if (nextAvailableSlot[col] == boardDimensions.row) return;
    const slot = nextAvailableSlot[col];

    if (slot == -1) return;
    boardModel[slot][col] = turn;
    nextAvailableSlot[col] --;
    setBoardModel([...boardModel]);
    setNextAvailableSlot([...nextAvailableSlot]);
  }

  return (
    <>
      <div>
        <p> babo connect 4</p>
        <GameContext.Provider value={ { boardModel, updateBoard, currentTurn, setCurrentTurn } }>
          <FichaDropPreview/>
          <Board/>
        </GameContext.Provider>
      </div>
    </>
  )
}

export default App
