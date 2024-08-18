import React from 'react';
import { useGameDispatch } from './GameContext';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/SungkaBackground.jpg'; // Adjust the path as needed


const PlayerModeSelection = () => {
  const dispatch = useGameDispatch();

  const handleModeSelect = (mode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  return (
    <div
      className="flex flex-col items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1 className="text-5xl font-bold mb-8 text-white">Welcome to ShellTactics</h1>
      <Link to="/rules" state={{ from: location.pathname }} className="text-4xl px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-4 mb-6">
        Rules
      </Link>
      <h2 className="text-3xl font-bold mb-8 text-white">Select Player Mode</h2>
      <Link to="/one-player" onClick={() => handleModeSelect('one-player')}>
        <button className="mb-4 p-4 bg-blue-500 text-white rounded-lg">Single Player</button>
      </Link>
      <Link to="/two-players" onClick={() => handleModeSelect('two-players')}>
        <button className="p-4 bg-green-500 text-white rounded-lg">Two Players</button>
      </Link>
    </div>
  );
};

export default PlayerModeSelection;
