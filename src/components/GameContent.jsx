// Start - GameContent.jsx
import React, { useEffect } from 'react';
import { useGameState } from './SungkaGameContext';
import PlayerModeSelection from './PlayerModeSelection';

const GameContent = () => {
  const { mode } = useGameState();

  useEffect(() => {
    console.log(`Game mode selected: ${mode}`);
  }, [mode]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <PlayerModeSelection />
    </div>
  );
};

export default GameContent;
// End - GameContent.jsx