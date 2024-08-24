// GameStatus.jsx
import React from 'react';

const GameStatus = ({ mode, currentTurn, winMessage, captureMessage }) => {
  return (
    <div className="text-center mb-4">
      <h2 className="text-lg font-bold text-green-500">{mode === 'one-player' ? "Player A vs AI" : "Player A vs Player B"}</h2>
      <h3 className="text-lg font-bold text-yellow-400">Current Turn: {currentTurn}</h3>
      {winMessage && (
        <div className="mb-4 p-4 text-center font-bold text-white bg-red-500 rounded-md">{winMessage}</div>
      )}
      {captureMessage && (
        <div className="mb-4 p-4 text-center font-bold text-white bg-blue-500 rounded-md">{captureMessage}</div>
      )}
    </div>
  );
};

export default GameStatus;
// GameStatus.jsx