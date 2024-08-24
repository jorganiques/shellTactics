// SungkaHole.jsx
import React from 'react';
import SeashellIcon from './SeashellIcon';
import SungkaShell from '../assets/SungkaShell.png';

const SungkaHole = ({ stones, label, index, isUlo, config, isHighlighted, isInvalidPit, handlePitClick }) => {
  return (
    <div
      onClick={() => handlePitClick(index)}
      className={`flex flex-col items-center justify-center h-${config.size} w-${config.size} 
      text-white font-bold cursor-pointer rounded-full ${isUlo ? 'bg-darkwood' : 'bg-wood'} ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        border: isHighlighted ? '5px solid #FFD700' : '5px solid transparent',  // Highlight border
        transition: 'border 0.3s ease', // Smooth transition for border highlighting
        cursor: isInvalidPit ? 'not-allowed' : 'pointer', // Change cursor to "not-allowed" (X) if the pit is invalid
      }}
    >
      <div className="text-transparent text-center text-xs mb-1">Pit {index + 1}</div> {/* Pit Identifier */}
      <div className="text-center text-sm mb-1 text-amber-50">{label}</div>
      <div className={`grid grid-cols-${config.gridCols} grid-rows-${config.gridRows} gap-1`}>
        {Array.from({ length: config.holeCount }).map((_, i) => (
          <div key={i} className="h-3.5 w-3.5 flex items-center justify-center bg-transparent rounded-full">
            {i < stones && <SeashellIcon imageSrc={SungkaShell} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SungkaHole;
// SungkaHole.jsx