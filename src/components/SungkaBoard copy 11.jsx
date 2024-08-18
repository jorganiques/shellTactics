import React, { useReducer, useEffect, useContext, createContext, useRef } from 'react';
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
            }, 4000); // 4-second delay before switching turns
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
        <div className="text-center text-xs mb-1">{label}</div>
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
        {winMessage && ( // Display win message if it exists
          <div className="mb-4">
            <p className="text-2xl font-bold text-green-600">{winMessage}</p>
          </div>
        )}
        <div className="grid grid-rows-2 gap-4 bg-darkerwood p-6 rounded-lg shadow-lg">
          {mode === 'one-player' ? (
            <>
              <div className="grid grid-cols-9 gap-4">
                <div className="col-span-1">
                  {renderPit(board[7], "Player A's ulo", 7, true)}
                </div>
                <div className="col-span-7 grid grid-cols-7 gap-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}>
                      {renderPit(board[6 - i], `Player A's bahay ${7 - i}`, 6 - i, false)}
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
                      {renderPit(board[8 + i], `AI's bahay ${i + 1}`, 8 + i, false)}
                    </div>
                  ))}
                </div>
                <div className="col-span-1">
                  {renderPit(board[15], "AI's ulo", 15, true)}
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
