// src/components/PlayerModeSelection.jsx
import React from 'react';
import { useGameDispatch } from './GameContext';
import { Link } from 'react-router-dom';

const PlayerModeSelection = () => {
  const dispatch = useGameDispatch();

  const handleModeSelect = (mode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Select Player Mode</h1>
      <Link to="/one-player" onClick={() => handleModeSelect('one-player')}>
        <button className="mb-4 p-4 bg-blue-500 text-white rounded-lg">One Player</button>
      </Link>
      <Link to="/two-players" onClick={() => handleModeSelect('two-players')}>
        <button className="p-4 bg-green-500 text-white rounded-lg">Two Players</button>
      </Link>
    </div>
  );
};

export default PlayerModeSelection;
