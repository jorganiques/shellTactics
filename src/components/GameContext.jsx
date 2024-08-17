// src/components/GameContext.jsx
import React, { createContext, useReducer, useContext } from 'react';

const GameStateContext = createContext();
const GameDispatchContext = createContext();

const initialState = {
  mode: null,
  board: Array(16).fill(0),
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_BOARD':
      return { ...state, board: action.payload };
    default:
      return state;
  }
};

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

export const useGameState = () => useContext(GameStateContext);
export const useGameDispatch = () => useContext(GameDispatchContext);
