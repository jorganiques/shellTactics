import React, { useEffect, useState } from 'react';
import { useGameState, useGameDispatch } from './GameContext';
import SeashellIcon from './SeashellIcon'; // Import the seashell icon

const SungkaBoard = ({ mode }) => {
  const { board } = useGameState();
  const dispatch = useGameDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      // Initialize board state here if needed
      const initialBoard = Array(16).fill(0);
      initialBoard[7] = 0;  // Player's ulo
      initialBoard[15] = 0; // Opponent's ulo
      for (let i = 0; i < 16; i++) {
        if (i !== 7 && i !== 15) {
          initialBoard[i] = 7; // Each pit starts with 7 stones
        }
      }
      dispatch({ type: 'SET_BOARD', payload: initialBoard });
      setInitialized(true);
    }
  }, [initialized, dispatch]);

  const renderPit = (stones, label, index, isUlo) => {
    const holesCount = isUlo ? 30 : 20; // Set 30 holes for ulo and 20 holes for small pits
    const gridCols = isUlo ? 5 : 5; // 5 columns for both ulo and small pits
    const gridRows = isUlo ? 6 : 4; // 6 rows for ulo, 4 rows for small pits

    return (
      <div
        key={index}
        className={`flex flex-col items-center justify-center h-40 w-40 bg-green-500 text-white font-bold rounded-full ${isUlo ? 'bg-red-500' : ''}`}
      >
        <div className="text-center text-xs mb-1">{label}</div>
        <div className={`grid grid-cols-${gridCols} grid-rows-${gridRows} gap-1`}>
          {Array.from({ length: holesCount }).map((_, i) => (
            <div key={i} className="h-3 w-3 flex items-center justify-center bg-white rounded-full">
              {i < stones && <SeashellIcon />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">
        {mode === 'one-player' ? 'One Player Mode' : 'Two Players Mode'}
      </h2>
      <div className="grid grid-rows-2 gap-4 bg-wood p-6 rounded-lg shadow-lg">
        {mode === 'one-player' ? (
          <>
            <div className="grid grid-cols-9 gap-4">
              <div className="col-span-1">
                {renderPit(board[7], "Player's ulo", 7, true)}
              </div>
              <div className="col-span-7 grid grid-cols-7 gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i}>
                    {renderPit(board[6 - i], `Player's pit ${7 - i}`, 6 - i, false)}
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
                    {renderPit(board[8 + i], `Computer's pit ${i + 1}`, 8 + i, false)}
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
  );
};

export default SungkaBoard;
