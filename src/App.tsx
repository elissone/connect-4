import '@/App.css'
import { Board } from '@/components/specific/Board';
import FichaDropPreview from './components/specific/FichaDropPreview';

export const App = () => {
  const boardDimensions = { row: 6, col: 6 }
  return (
    <>
      <div>
        <p> babo </p>
        <FichaDropPreview columnSize={boardDimensions.col} currentTurn={'red'}/>
        <Board boardDimensions={boardDimensions}/>
      </div>
    </>
  )
}

export default App
