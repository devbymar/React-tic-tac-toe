import { useState } from 'react'
import './App.css'

const TURNS = {
  X: '✕',
  O: '◯'
}

const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `cell ${isSelected ? 'selected' : ''}`

  const handleClick = () => {
    updateBoard(index)
  }

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

// Counters
function createGameState() {
  return {
    rows: [0, 0, 0],
    cols: [0, 0, 0],
    diags: [0, 0],
    winner: null
  }
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [turn, setTurn] = useState(TURNS.X)
  const [winner, setWinner] = useState(null)
  const [state, setState] = useState(createGameState)

  const updateBoard = (index) => {
    // Do not write if the position or a winner already exists
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // row and column of the play
    const row = Math.floor(index / 3)
    const col = index % 3
    const value = turn === TURNS.X ? 1 : -1

    // counters
    const newState = {
      rows: [...state.rows],
      cols: [...state.cols],
      diags: [...state.diags],
      winner: state.winner
    }

    // update counters
    newState.rows[row] += value
    newState.cols[col] += value
    if (row === col) newState.diags[0] += value
    if (row + col === 2) newState.diags[1] += value

    // check winner
    if (
      Math.abs(newState.rows[row]) === 3 ||
      Math.abs(newState.cols[col]) === 3 ||
      Math.abs(newState.diags[0]) === 3 ||
      Math.abs(newState.diags[1]) === 3
    ) {
      newState.winner = turn
      setWinner(turn)
    }

    setState(newState)

    // change turn if there's no winner
    if (!newState.winner) {
      setTurn(turn === TURNS.X ? TURNS.O : TURNS.X)
    }
  }

  // Restart the game
  const restartGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    setState(createGameState())
  }

  return (
    <main className='board'>
      <h1>Tic tac toe</h1>

      <section className='game'>
        {board.map((_, index) => (
          <Square
            key={index}
            index={index}
            updateBoard={updateBoard}
          >
            {board[index]}
          </Square>
        ))}
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <button className="restart" onClick={restartGame}>
        🔄 Restart
      </button>

      {winner && (
        <section className="winner">
          <span>🎉 The Winner is {winner} 🎉</span>
          <button onClick={() => window.location.reload()}>Restart</button>
        </section>
      )}

    </main>
  )
}

export default App
