// src/components/GameContent.jsx
import React, { useEffect } from 'react';
import { useGameState } from './GameContext';
import PlayerModeSelection from './PlayerModeSelection';
import { Link } from 'react-router-dom';


const GameContent = () => {
  const { mode } = useGameState();

  useEffect(() => {
    // Any side effects based on game mode can be handled here
    console.log(`Game mode selected: ${mode}`);
  }, [mode]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <PlayerModeSelection />
    </div>
  );
};

export default GameContent;
