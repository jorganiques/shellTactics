// Start - SungkaGameContext.jsx
import React, { createContext, useReducer, useContext } from 'react';

// Create context
const GameStateContext = createContext();
const GameDispatchContext = createContext();

// Initial state
const initialState = {
  board: Array(16).fill(7).map((_, i) => (i === 7 || i === 15 ? 0 : 7)),
  currentTurn: 'Player A',
  animating: false,
  captureMessage: '',
  winMessage: '',
  gameEnded: false,
};

// Reducer function
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BOARD':
      return { ...state, board: action.payload };
    case 'SET_TURN':
      return { ...state, currentTurn: action.payload };
    // case 'SET_ANIMATING':
    //  return { ...state, animating: action.payload };
    case 'SET_ANIMATING_AND_CAPTURE':
      return {
        ...state,
        animating: action.payload.animating,
        captureMessage: action.payload.captureMessage,
      };  
    case 'SET_CAPTURE_MESSAGE':
      return { ...state, captureMessage: action.payload };
    case 'SET_WIN_MESSAGE':
      return { ...state, winMessage: action.payload };
    // case 'SET_GAME_ENDED':
    //  return { ...state, gameEnded: action.payload };
    case 'RESET_GAME':
      return initialState;
    case 'SWITCH_TURN':
      const currentTurn = state.currentTurn === 'Player A' ? 'Player B' : 'Player A';
      return { ...state, currentTurn };  
    case 'END_GAME':
      return {
        ...state,
        board: action.payload.board,
        winMessage: `${action.payload.winner} wins!`,
        gameEnded: true,
      };
    default:
      return state;
  }
};

// GameProvider component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

// Custom hooks to use context
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
};

export const useGameDispatch = () => {
  const context = useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }
  return context;
};

// End - SungkaGameContext.jsx