import React, { useReducer, useEffect, useContext, createContext, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import SeashellIcon from './SeashellIcon'; // Import the seashell icon

// Create a GameContext for global state management
const GameContext = createContext();

const initialState = {
  board: Array(16).fill(7).map((_, i) => (i === 7 || i === 15 ? 0 : 7)),
  currentTurn: 'Player A',
  animating: false,
  captureMessage: '',
  winMessage: '',
  gameEnded: false, // New state to track if the game has ended
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BOARD':
      return { ...state, board: action.payload };
    case 'SET_TURN':
      return { ...state, currentTurn: action.payload };
    case 'SET_ANIMATING':
      return { ...state, animating: action.payload };
    case 'SET_CAPTURE_MESSAGE':
      return { ...state, captureMessage: action.payload };
    case 'SET_WIN_MESSAGE':
      return { ...state, winMessage: action.payload };
    case 'SET_GAME_ENDED':
      return { ...state, gameEnded: action.payload }; // Handle game-ended state
    case 'RESET_GAME':
      return initialState; // Reset to the initial state
    default:
      return state;
  }
};

export const useGameState = () => useContext(GameContext);
export const useGameDispatch = () => useContext(GameContext);

const SungkaBoard = ({ mode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { board, currentTurn, animating, captureMessage, winMessage, gameEnded } = state;
  const animatingRef = useRef(animating);

  useEffect(() => {
    if (animatingRef.current !== animating) {
      animatingRef.current = animating;
    }
  }, [animating]);

  useEffect(() => {
    if (mode === 'one-player' && currentTurn === 'Player B' && !animating && !gameEnded) {
      setTimeout(() => handleComputerTurn(), 1000); // Delay for the computer's move
    }
  }, [currentTurn, animating, gameEnded]);

  useEffect(() => {
    if (!gameEnded && isOutOfMoves(currentTurn)) {
      checkEndGame();
    }
  }, [currentTurn, board, gameEnded]);

  const handlePitClick = (index) => {
    if (animating || board[index] === 0 || !isValidPit(index) || gameEnded) return;

    dispatch({ type: 'SET_ANIMATING', payload: true });
    dispatch({ type: 'SET_CAPTURE_MESSAGE', payload: '' });

    let stones = board[index];
    let newBoard = [...board];
    newBoard[index] = 0;

    const distributeStones = () => {
      if (stones > 0) {
        index = (index + 1) % 16;
        if (shouldSkipUlo(index)) return distributeStones();

        newBoard[index] += 1;
        stones -= 1;
        dispatch({ type: 'SET_BOARD', payload: newBoard });
        setTimeout(distributeStones, 500); // Animate the movement every 500ms
      } else {
        dispatch({ type: 'SET_ANIMATING', payload: false });
        checkCapture(index);
        if (!checkExtraTurn(index)) {
          if (isOutOfMoves(currentTurn)) {
            checkEndGame();
          } else {
            switchTurn();
          }
        }
      }
    };

    distributeStones();
  };

  const handleComputerTurn = () => {
    const validPits = board.slice(8, 15).map((stones, i) => stones > 0 && i + 8).filter(Boolean);
    const randomPit = validPits[Math.floor(Math.random() * validPits.length)];
    handlePitClick(randomPit);
  };

  const isValidPit = (index) => (currentTurn === 'Player A' && index < 7) || (currentTurn === 'Player B' && index > 7);

  const shouldSkipUlo = (index) =>
    (currentTurn === 'Player A' && index === 15) || (currentTurn === 'Player B' && index === 7);

  const checkCapture = (lastIndex) => {
    const isPlayerA = currentTurn === 'Player A';
    const isOwnPit = isPlayerA ? lastIndex < 7 : lastIndex >= 8 && lastIndex < 15;
    const oppositeIndex = 14 - lastIndex;

    if (isOwnPit && board[lastIndex] === 1 && board[oppositeIndex] > 0) {
      let newBoard = [...board];
      const uloIndex = isPlayerA ? 7 : 15;

      newBoard[uloIndex] += newBoard[oppositeIndex] + 1;
      newBoard[lastIndex] = 0;
      newBoard[oppositeIndex] = 0;

      const pitNumber = oppositeIndex < 7 ? oppositeIndex + 1 : oppositeIndex - 7;
      const opponent = isPlayerA ? 'AI' : 'Player A';
      dispatch({
        type: 'SET_CAPTURE_MESSAGE',
        payload: `${currentTurn} captured bahay number ${pitNumber} of the ${opponent}.`,
      });

      dispatch({ type: 'SET_BOARD', payload: newBoard });

      if (mode === 'one-player' && currentTurn === 'Player A') {
        setTimeout(() => {
          dispatch({ type: 'SET_CAPTURE_MESSAGE', payload: '' });
          switchTurn();
        }, 10000); // 10-second delay before switching turns
      } else {
        switchTurn();
      }
    }
  };

  const checkExtraTurn = (lastIndex) => (currentTurn === 'Player A' && lastIndex === 7) || (currentTurn === 'Player B' && lastIndex === 15);

  const switchTurn = () => {
    const nextTurn = currentTurn === 'Player A' ? 'Player B' : 'Player A';
    dispatch({ type: 'SET_TURN', payload: nextTurn });
  };

  const checkEndGame = () => {
    const [playerAPits, playerBPits] = [board.slice(0, 7), board.slice(8, 15)]
      .map(pits => pits.reduce((acc, stones) => acc + stones, 0));

    if (playerAPits === 0 || playerBPits === 0) {
      let newBoard = [...board];
      newBoard[7] += playerAPits;
      newBoard[15] += playerBPits;
      for (let i = 0; i < 7; i++) newBoard[i] = 0;
      for (let i = 8; i < 15; i++) newBoard[i] = 0;

      dispatch({ type: 'SET_BOARD', payload: newBoard });

      const winner = newBoard[7] > newBoard[15] ? 'Player A' : 'Player B';
      dispatch({
        type: 'SET_WIN_MESSAGE',
        payload: `${winner} wins!`,
      });
      dispatch({ type: 'SET_GAME_ENDED', payload: true }); // Mark the game as ended
    }
  };

  const isOutOfMoves = (player) => board.slice(player === 'Player A' ? 0 : 8, player === 'Player A' ? 7 : 15).every(pit => pit === 0);

  const renderPit = (stones, label, index, isUlo) => {
    const holesCount = isUlo ? 84 : 35;
    const gridCols = isUlo ? 7 : 7;
    const gridRows = isUlo ? 12 : 5;

    return (
      <div
        key={index}
        onClick={() => handlePitClick(index)}
        className={`flex flex-col items-center justify-center h-${isUlo ? 55 : 40} w-${
          isUlo ? 55 : 40
        } text-white font-bold rounded-full ${isUlo ? 'bg-darkwood' : 'bg-wood'}`}
      >
        <div className="text-transparent text-center text-xs mb-1">Pit {index + 1}</div> {/* Pit Identifier */}
        <div className="text-center text-sm mb-1 text-amber-50">{label}</div>
        <div className={`grid grid-cols-${gridCols} grid-rows-${gridRows} gap-1`}>
          {Array.from({ length: holesCount }).map((_, i) => (
            <div key={i} className="h-3.5 w-3.5 flex items-center justify-center bg-transparent rounded-full">
              {i < stones && <SeashellIcon />}
            </div>
          ))}
        </div>
      </div>
    );
  };

const pitLabelMap = ["Bahay 1", "Bahay 2", "Bahay 3", "Bahay 4", "Bahay 5", "Bahay 6", "Bahay 7"];

const renderRow = (start, end, isPlayerA) => (
  <div className="grid grid-cols-9 gap-4">
    <div className="col-span-1">
      {isPlayerA && renderPit(board[7], "Player A's ulo", 7, true)}
    </div>
    <div className="col-span-7 grid grid-cols-7 gap-4">
      {Array.from({ length: end - start }).map((_, i) => {
        const pitIndex = isPlayerA ? end - i - 1 : start + i;
        let currPit = pitIndex + 1;

        // Adjust label for Player B/AI pits
        const bahay = pitIndex >= 8 && pitIndex <= 14 ? pitLabelMap[currPit - 9] : `Bahay ${currPit}`;

        return renderPit(board[pitIndex], bahay, pitIndex, false);
      })}
    </div>
    <div className="col-span-1">
      {!isPlayerA && renderPit(board[15], mode === "two-players" ? "Player B's ulo" : "AI's ulo", 15, true)}
    </div>
  </div>
);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div className="container mx-auto mt-5 p-4 bg-[#3A1E10] rounded-lg shadow-lg">
        {/* Action buttons */}
        <div className="flex justify-center space-x-4 mt-4">
          <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Home</Link>
          <button
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reset
          </button>
          <Link to="/rules" state={{ from: location.pathname }} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Rules</Link>
        </div>
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-zinc-300">{mode === 'one-player' ? "Player A vs AI" : "Player A vs Player B"}</h2>
          <h3 className="text-lg font-bold text-yellow-400">Current Turn: {currentTurn}</h3>
        </div>
        {winMessage && (
          <div className="mb-4 p-4 text-center font-bold text-white bg-red-500 rounded-md">{winMessage}</div>
        )}
        {captureMessage && (
          <div className="mb-4 p-4 text-center font-bold text-white bg-blue-500 rounded-md">{captureMessage}</div>
        )}
        {renderRow(8, 15, false)} {/* Player B (Computer) */}
        {renderRow(0, 7, true)} {/* Player A */}
        <div className="mt-4 flex justify-center items-center">
        </div>
      </div>
    </GameContext.Provider>
  );
};

export default SungkaBoard;
