// Start - SungkaBoard.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useSungkaGameLogic } from './useSungkaGameLogic';
import SungkaHole from './SungkaHole';
import Controls from './Controls';
import GameStatus from './GameStatus';
import { useGameDispatch, useGameState } from './SungkaGameContext'; 


const SungkaBoard = ({ mode }) => {
  const {
    board,
    currentTurn,
    captureMessage,
    winMessage,
    feedbackMessage,
    highlightedPits,
    handlePitClick,
    isValidPit,
  } = useSungkaGameLogic(mode);

  const dispatch = useGameDispatch(); // Get dispatch function

  const renderPit = (stones, label, index, isUlo) => {

    // Configuration objects for ulo and non-ulo pits
    const uloConfig = {
      holeCount: 98,
      gridCols: 7,
      gridRows: 14,
      size: 55,
    };
  
    const nonUloConfig = {
      holeCount: 49,
      gridCols: 7,
      gridRows: 7,
      size: 40,
    };

    // Select the appropriate configuration based on isUlo
    const config = isUlo ? uloConfig : nonUloConfig;

    // Determine if the pit should be highlighted based on the current player
    const isHighlighted = currentTurn === 'Player A'
        ? index < 7 && highlightedPits.includes(index)
        : index >= 8 && index < 15 && highlightedPits.includes(index);

    const isInvalidPit = !isValidPit(index); // Check if the pit is invalid for the current player

    return (
      <SungkaHole
      key={index}
      stones={stones}
      label={label}
      index={index}
      isUlo={isUlo}
      config={config}
      isHighlighted={isHighlighted}
      isInvalidPit={isInvalidPit}
      handlePitClick={handlePitClick}
    />
    );
  };

const pitLabelMap = ["Bahay 1", "Bahay 2", "Bahay 3", "Bahay 4", "Bahay 5", "Bahay 6", "Bahay 7"];

const getPitInfo = (i, start, end, isPlayerA) => {
  const pitIndex = isPlayerA ? end - i - 1 : start + i;
  const currPit = pitIndex + 1;
  const isPlayerBPit = pitIndex >= 8 && pitIndex <= 14;
  const bahay = isPlayerBPit ? pitLabelMap[currPit - 9] : `Bahay ${currPit}`;

  return { pitIndex, bahay };
};

const renderRow = (start, end, isPlayerA) => (
  <div className="grid grid-cols-9 gap-4">
    <div className="col-span-1">
      {isPlayerA && renderPit(board[7], "Player A's ulo", 7, true)}
    </div>
    <div className="col-span-7 grid grid-cols-7 gap-4">
        {Array.from({ length: end - start }).map((_, i) => {
        const { pitIndex, bahay } = getPitInfo(i, start, end, isPlayerA);
        return renderPit(board[pitIndex], bahay, pitIndex, false);
      })}
    </div>
    <div className="col-span-1">
      {!isPlayerA && renderPit(board[15], mode === "two-players" ? "Player B's ulo" : "AI's ulo", 15, true)}
    </div>
  </div>
);

  return (
    
      <div className="container mx-auto mt-5 p-4 bg-[#3A1E10] rounded-lg shadow-lg">
        <Controls onReset={() => dispatch({ type: 'RESET_GAME' })} />
        <GameStatus
        mode={mode}
        currentTurn={currentTurn}
        winMessage={winMessage}
        captureMessage={captureMessage}
      />
        {feedbackMessage && (
        <div className="mb-4 p-2 text-center bg-yellow-300 text-black rounded">
          {feedbackMessage}
        </div>
        )}
        {renderRow(8, 15, false)} {/* Player B (Computer) */}
        {renderRow(0, 7, true)} {/* Player A */}
        <div className="mt-4 flex justify-center items-center">
        </div>
      </div>
   
  );
};

export default SungkaBoard;
// Start - SungkaBoard.jsx
