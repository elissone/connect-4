import { useContext, createContext, useState } from "react";
import { FichaColor } from "@/components/specific/Ficha";

interface GameContextValues {
   currentTurn: FichaColor;
   setCurrentTurn: (turn: FichaColor) => void;
   boardModel: FichaColor[][]
   updateBoard: (col: number, turn: Exclude<FichaColor, null>) => void
   winner: FichaColor
}

interface GameContextProps {
  children: React.ReactNode
  winLineLength: number
  boardDimensions: {
    row: number,
    col: number
  }
}

const GameContext = createContext<GameContextValues>({
  currentTurn: null,
  setCurrentTurn: () => {},
  winner: null,
  boardModel: Array(6).map(() => Array(6).fill(null)),
  updateBoard: () => {}
});

export const GameProvider = (props: GameContextProps) => {
  const { children, winLineLength, boardDimensions, ...otherProps} = props;

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
      if (winLineLength > boardDimensions.row || winLineLength > boardDimensions.col)
        return false;
      const optIdxs = {
        row: Array.from({ length: winsPerRow }),
        col: Array.from({ length: winsPerColumn })
      };

      return optIdxs.col.some(
        (_, cPiv) => optIdxs.row.some((_, rPiv) => {
          return winLineIdxs.every((_, i) => boardModel[cPiv + i][winsPerRow + rPiv - i] == currentTurn)
            || winLineIdxs.every((_, i) => boardModel[cPiv + i][rPiv + i] == currentTurn);
        }
      ));
    };

    const winComputes = [checkColumns, checkRows, checkDiagonals];

    winComputes.some( (computeWin) => {
      if (computeWin()) {
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

  const value = {
    currentTurn,
    setCurrentTurn,
    winner,
    boardModel,
    updateBoard
  };

  return (
    <GameContext.Provider {...otherProps} value={value}>
      { children }
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const gameContext = useContext(GameContext);

  if (gameContext === undefined)
  throw new Error("useGame must be used within a GameProvider")

  return gameContext;
};