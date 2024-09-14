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
   winner: FichaColor
}

export const GameContext = createContext<GameContextValues>({
  currentTurn: null,
  setCurrentTurn: () => {},
  winner: null,
  boardModel: Array(6).map(() => Array(6).fill(null)),
  updateBoard: () => {}
});
export const useGameContext = () => useContext(GameContext);

export const App = () => {
  const boardDimensions = { row: 6, col: 6 }
  const winLineLength = 4;

  const [currentTurn, setCurrentTurn] = useState<FichaColor>('red');
  const [winner, setWinner] = useState<FichaColor>(null);
  const [boardModel, setBoardModel] = useState<GameContextValues['boardModel']>(
    new Array(boardDimensions.row).fill(null).map(() => Array(boardDimensions.col).fill(null))
  );
  const [nextAvailableSlot, setNextAvailableSlot] = 
    useState<number[]>(boardModel[0].map((_) => boardDimensions.row - 1));

  const calculateWinner = () => {
    const winsPerColumn = boardDimensions.col - winLineLength + 1;
    const winsPerRow = boardDimensions.row - winLineLength + 1;
    const winLineIdxs = Array.from({ length: winLineLength });
    
    // check columns for wins
    const checkColumns = () => nextAvailableSlot
      .some((slot, c) => {
        if (slot >= boardDimensions.row - winLineLength) return false;
        const optIdxs = Array.from({ length: winsPerColumn});

        return optIdxs.some((_, piv) => boardModel[c]
          .slice(winsPerColumn - piv - 1, winsPerColumn - piv - 1 + winLineLength)
          .every((ficha) => ficha === currentTurn));
      });

    // check rows for wins
    const checkRows = () => {
      const rowsToCheckIdxs = Array.from(
        { length: boardDimensions.row - Math.min(...nextAvailableSlot) - 1 }
      );
      const optIdxs = Array.from({ length: winsPerRow});

      return optIdxs.some((_, piv) => rowsToCheckIdxs.some(
        (_, r)  => {
          r = boardDimensions.row - 1 - r;
          return winLineIdxs.every((_, c) => boardModel[piv+c][r] === currentTurn);
        }
      ));
    };

    // check diagonals for wins
    const checkDiagonals = () => {
      if (winLineLength > boardDimensions.row || winLineLength > boardDimensions.col) return;
      const optIdxs = {
        row: Array.from({ length: winsPerRow }),
        col: Array.from({ length: winsPerColumn })
      };

      return optIdxs.col.some(
        (_, cPiv) => optIdxs.row.some((_, rPiv) => {
          const lineUp = winLineIdxs.map((_, i) => boardModel[cPiv + i][winsPerRow + rPiv - i]);
          const lineDown = winLineIdxs.map((_, i) => boardModel[cPiv + i][rPiv + i]);
          return lineUp.every((v) => v === currentTurn) || lineDown.every((v) => v === currentTurn);
        }
      ));
    };
    
    const winComputes = [checkColumns, checkRows, checkDiagonals];

    winComputes.some( (computeWin) => {
      const isWin = computeWin()
      if (isWin) {
        setWinner(currentTurn);
        return true;
      }
      return false;
    });
  }

  const updateBoard: GameContextValues['updateBoard'] = (col: number, turn: Exclude<FichaColor, null>) => {
    const slot = nextAvailableSlot[col];
    if (slot == -1) return;
    boardModel[col][slot] = turn;
    nextAvailableSlot[col] --;
    setBoardModel([...boardModel]);
    setNextAvailableSlot([...nextAvailableSlot]);

    calculateWinner();
  }

  return (
    <div>
      <p> babo connect 4</p>
      <GameContext.Provider value={{ winner, boardModel, updateBoard, currentTurn, setCurrentTurn }}>
        <FichaDropPreview/>
        <Board/>
        winner: {winner}
      </GameContext.Provider>
    </div>
  );
};

export default App
