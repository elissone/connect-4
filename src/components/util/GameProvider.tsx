import { useContext, createContext, useState, useEffect } from "react";
import { FichaColor } from "@/components/specific/Ficha";
import { useSettings } from "@/components/util/SettingsProvider";

interface GameContextValues {
   currentTurn: FichaColor;
   setCurrentTurn: (turn: FichaColor) => void;
   boardModel: FichaColor[][];
   updateBoard: (col: number, turn: Exclude<FichaColor, null>) => void;
   winner: FichaColor;
   gameLostFocus: boolean;
   setGameLostFocus: (lf: boolean) => void;
   justDroppedCol: number;
   setJustDroppedCol: (col: number) => void;
   nextAvailableSlot: number[];
}

interface GameContextProps { children: React.ReactNode };

const GameContext = createContext<GameContextValues>({
  currentTurn: null,
  setCurrentTurn: () => {},
  winner: null,
  boardModel: Array(6).map(() => Array(6).fill(null)),
  updateBoard: () => {},
  gameLostFocus: false,
  setGameLostFocus: () => {},
  justDroppedCol: -1,
  setJustDroppedCol: () => {},
  nextAvailableSlot: []
});

export const GameProvider = (props: GameContextProps) => {
  const { children, ...otherProps} = props;
  const { boardDimensions, connectionLength } = useSettings();

  const [currentTurn, setCurrentTurn] = useState<FichaColor>('red');
  const [winner, setWinner] = useState<FichaColor>(null);
  const [boardModel, setBoardModel] = useState<GameContextValues['boardModel']>(
    new Array(boardDimensions.row).fill(null).map(() => Array(boardDimensions.col).fill(null))
  );
  const [nextAvailableSlot, setNextAvailableSlot] = useState<number[]>(
    Array(boardDimensions.row).fill(boardDimensions.col - 1)
  );
  const [justDroppedCol, setJustDroppedCol] = useState<number>(-1);
  const [gameLostFocus, setGameLostFocus] = useState(false);

  useEffect(
    () => {
      setBoardModel(
        new Array(boardDimensions.row).fill(null).map(() => Array(boardDimensions.col).fill(null))
      );
      setNextAvailableSlot(Array(boardDimensions.row).fill(boardDimensions.col - 1));
    },
    [boardDimensions, connectionLength]
  );

  const calculateWinner = () => {
    const winsPerColumn = boardDimensions.col - connectionLength + 1;
    const winsPerRow = boardDimensions.row - connectionLength + 1;
    const winLineIdxs = Array.from({ length: connectionLength });

    // check columns for wins
    const checkColumns = () => nextAvailableSlot
      .some((slot, c) => {
        if (slot >= boardDimensions.row - connectionLength) return false;
        const optIdxs = Array.from({ length: winsPerColumn});

        return optIdxs.some((_, piv) => boardModel[c]
          .slice(winsPerColumn - piv - 1, winsPerColumn - piv - 1 + connectionLength)
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
      if (connectionLength > boardDimensions.row || connectionLength > boardDimensions.col)
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
    console.log('im finna set the num to', col)
    setJustDroppedCol(col);

    const timeoutFunc = () => {
      const slot = nextAvailableSlot[col];
      if (slot == -1) return;
      boardModel[col][slot] = turn;
      nextAvailableSlot[col] --;
      setBoardModel([...boardModel]);
      setNextAvailableSlot([...nextAvailableSlot]);
      setJustDroppedCol(-1);

      calculateWinner();
      setCurrentTurn(currentTurn === 'red' ? 'yellow' : 'red');
    }

    setTimeout(timeoutFunc, 400);
  }

  const value = {
    currentTurn,
    setCurrentTurn,
    winner,
    boardModel,
    updateBoard,
    gameLostFocus,
    nextAvailableSlot,
    setGameLostFocus,
    justDroppedCol,
    setJustDroppedCol
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