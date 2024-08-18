import React, { useReducer, useEffect, useContext, createContext, useRef } from 'react';
import SeashellIcon from './SeashellIcon'; // Import the seashell icon

// Create a GameContext for global state management
const GameContext = createContext();

const initialState = {
  board: Array(16).fill(7).map((_, i) => (i === 7 || i === 15 ? 0 : 7)),
  currentTurn: 'Player A',
  animating: false,
  captureMessage: '', // New state for capture message
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
    default:
      return state;
  }
};

export const useGameState = () => useContext(GameContext);
export const useGameDispatch = () => useContext(GameContext);

const SungkaBoard = ({ mode }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { board, currentTurn, animating, captureMessage } = state;
  const animatingRef = useRef(animating);

  useEffect(() => {
    if (animatingRef.current !== animating) {
      animatingRef.current = animating;
    }
  }, [animating]);

  useEffect(() => {
    if (mode === 'one-player' && currentTurn === 'Player B' && !animating) {
      setTimeout(() => computerTurn(), 1000); // Delay for the computer's move
    }
  }, [currentTurn, animating]);

  useEffect(() => {
    if (currentTurn === 'Player A' && isOutOfMoves()) {
      checkEndGame(); // Check end game if Player A is out of moves
    }
  }, [currentTurn, board]);

  useEffect(() => {
    if (currentTurn === 'Player B' && isOutOfMoves()) {
      checkEndGame(); // Check end game if Player B is out of moves
    }
  }, [currentTurn, board]);

  const handlePitClick = (index) => {
    if (animating || board[index] === 0 || !isValidPit(index)) return;

    dispatch({ type: 'SET_ANIMATING', payload: true });
    dispatch({ type: 'SET_CAPTURE_MESSAGE', payload: '' }); // Clear previous capture message

    let stones = board[index];
    let newBoard = [...board];
    newBoard[index] = 0;

    const distributeStones = () => {
      if (stones > 0) {
        index = (index + 1) % 16;

        if ((currentTurn === 'Player A' && index === 15) || (currentTurn === 'Player B' && index === 7)) {
          return distributeStones(); // Skip opponent's ulo
        }

        newBoard[index] += 1;
        stones -= 1;
        dispatch({ type: 'SET_BOARD', payload: newBoard });
        setTimeout(distributeStones, 750); // Animate the movement every 750ms
      } else {
        dispatch({ type: 'SET_ANIMATING', payload: false });
        checkCapture(index); // Call checkCapture after the last stone is placed
        if (!checkExtraTurn(index)) {
          if (isOutOfMoves()) {
            checkEndGame(); // Trigger end game if no valid moves are left
          } else {
            switchTurn(); // Switch turns after a move unless the player gets an extra turn
          }
        }
      }
    };

    distributeStones();
  };

  const computerTurn = () => {
    let validPits = [];
    for (let i = 8; i < 15; i++) {
      if (board[i] > 0) validPits.push(i);
    }
    const randomPit = validPits[Math.floor(Math.random() * validPits.length)];
    handlePitClick(randomPit);
  };

  const isValidPit = (index) => {
    if (currentTurn === 'Player A' && index > 6) return false;
    if (currentTurn === 'Player B' && index < 8) return false;
    return true;
  };

  const checkCapture = (lastIndex) => {
    const isPlayerA = currentTurn === 'Player A';
    const isOwnPit = isPlayerA ? lastIndex < 7 : lastIndex >= 8 && lastIndex < 15;
    const oppositeIndex = 14 - lastIndex;

    // Check if the last stone lands in the player's own empty pit and the opposite pit has stones
    if (isOwnPit && board[lastIndex] === 1 && board[oppositeIndex] > 0) {
        let newBoard = [...board];
        const uloIndex = isPlayerA ? 7 : 15;

        // Capture stones
        newBoard[uloIndex] += newBoard[oppositeIndex] + 1; // Add captured stones to ulo
        newBoard[lastIndex] = 0; // Remove stone from the lastIndex pit
        newBoard[oppositeIndex] = 0; // Remove stones from the opposite pit

        // Set capture message
        const pitNumber = oppositeIndex < 7 ? oppositeIndex + 1 : oppositeIndex - 7;
        const opponent = isPlayerA ? 'computer' : 'Player A';
        dispatch({
            type: 'SET_CAPTURE_MESSAGE',
            payload: `You captured pit number ${pitNumber} of the ${opponent}.`,
        });

        dispatch({ type: 'SET_BOARD', payload: newBoard });
    }
};

  const checkExtraTurn = (lastIndex) => {
    if ((currentTurn === 'Player A' && lastIndex === 7) || (currentTurn === 'Player B' && lastIndex === 15)) {
      return true;
    }
    return false;
  };

  const switchTurn = () => {
    const nextTurn = currentTurn === 'Player A' ? 'Player B' : 'Player A';
    dispatch({ type: 'SET_TURN', payload: nextTurn });
  };

  const checkEndGame = () => {
    const playerAPits = board.slice(0, 7).reduce((acc, stones) => acc + stones, 0);
    const playerBPits = board.slice(8, 15).reduce((acc, stones) => acc + stones, 0);

    if (playerAPits === 0 || playerBPits === 0) {
      let newBoard = [...board];
      newBoard[7] += playerAPits;
      newBoard[15] += playerBPits;
      for (let i = 0; i < 7; i++) newBoard[i] = 0;
      for (let i = 8; i < 15; i++) newBoard[i] = 0;

      dispatch({ type: 'SET_BOARD', payload: newBoard });

      const winner = newBoard[7] > newBoard[15] ? 'Player A' : 'Player B';
      alert(`${winner} wins!`);
    }
  };

  const isOutOfMoves = () => {
    if (currentTurn === 'Player A') {
      return board.slice(0, 7).every(pit => pit === 0);
    } else {
      return board.slice(8, 15).every(pit => pit === 0);
    }
  };

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
        } bg-wood text-white font-bold rounded-full ${isUlo ? 'bg-darkwood' : ''}`}
      >
        <div className="text-center text-xs mb-1">{label}</div>
        <div className="text-center text-xs mb-1">Pit {index + 1}</div> {/* Pit Identifier */}
        <div className={`grid grid-cols-${gridCols} grid-rows-${gridRows} gap-1`}>
          {Array.from({ length: holesCount }).map((_, i) => (
            <div key={i} className="h-3.5 w-3.5 flex items-center justify-center bg-white rounded-full">
              {i < stones && <SeashellIcon />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">
          {mode === 'one-player' ? 'One Player Mode' : 'Two Players Mode'}
        </h2>
        <div className="mb-4">
          <p className="text-xl font-bold text-blue-600">{currentTurn}'s Turn</p>
        </div>
        {captureMessage && ( // Display capture message if it exists
          <div className="mb-4">
            <p className="text-lg font-semibold text-red-600">{captureMessage}</p>
          </div>
        )}
        <div className="grid grid-rows-2 gap-4 bg-darkerwood p-6 rounded-lg shadow-lg">
          {mode === 'one-player' ? (
            <>
              <div className="grid grid-cols-9 gap-4">
                <div className="col-span-1">
                  {renderPit(board[7], "Player's ulo", 7, true)}
                </div>
                <div className="col-span-7 grid grid-cols-7 gap-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}>
                      {renderPit(board[6 - i], `Player's bahay ${7 - i}`, 6 - i, false)}
                    </div>
                  ))}
                </div>
                <div className="col-span-1" />
              </div>
              <div className="grid grid-cols-9 gap-4">
                <div className="col-span-1" />
                <div className="col-span-7 grid grid-cols-7 gap-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}>
                      {renderPit(board[8 + i], `Computer's bahay ${i + 1}`, 8 + i, false)}
                    </div>
                  ))}
                </div>
                <div className="col-span-1">
                  {renderPit(board[15], "Computer's ulo", 15, true)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-9 gap-4">
                <div className="col-span-1">
                  {renderPit(board[7], "Player A's ulo", 7, true)}
                </div>
                <div className="col-span-7 grid grid-cols-7 gap-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}>
                      {renderPit(board[6 - i], `Player A's pit ${7 - i}`, 6 - i, false)}
                    </div>
                  ))}
                </div>
                <div className="col-span-1" />
              </div>
              <div className="grid grid-cols-9 gap-4">
                <div className="col-span-1" />
                <div className="col-span-7 grid grid-cols-7 gap-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}>
                      {renderPit(board[8 + i], `Player B's pit ${i + 1}`, 8 + i, false)}
                    </div>
                  ))}
                </div>
                <div className="col-span-1">
                  {renderPit(board[15], "Player B's ulo", 15, true)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </GameContext.Provider>
  );
};

export default SungkaBoard;
