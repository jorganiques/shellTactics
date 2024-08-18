import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const RulesPage = () => {
  const location = useLocation();

  // Determine the previous path
  const previousPath = location.state?.from || '/';

  return (
    <div className="container mx-auto mt-5 p-4 bg-[#3A1E10] rounded-lg shadow-lg">
      <h1 className="text-center text-2xl font-bold text-white mb-4">ShellTactics Rules</h1>
      <div className="text-white text-lg leading-relaxed">
        <p><strong>Objective:</strong> The goal of the game is to capture more stones (seashells) than your opponent by the end of the game.</p>
        <p><strong>Game Setup:</strong> The board consists of two rows of seven pits for each player, with Player A's pits on the left side and Player B's (or the AI's) pits on the right. Each pit starts with seven stones. The two larger pits, called ulo, are at the far ends of the board: Player A's ulo on the left and Player B's ulo on the right.</p>
        <p><strong>How to Play:</strong></p>
        <ul className="list-disc list-inside mb-4">
          <li>Players take turns selecting one of their pits and distributing the stones one by one into each subsequent pit, moving clockwise around the board.</li>
          <li>If the last stone you drop lands in your own ulo, you get another turn.</li>
          <li>If the last stone lands in an empty pit on your side of the board and the opposite pit contains stones, you capture all the stones from the opposite pit and your own stone. These captured stones are placed in your ulo.</li>
        </ul>
        <p><strong>Game End:</strong> The game ends when all the pits on one side of the board are empty. The remaining stones on the other side of the board are placed into that player's ulo. The player with the most stones in their ulo wins the game.</p>
        <p><strong>Player Turns:</strong> In one-player mode, the AI takes a turn after Player A. In two-player mode, players alternate turns.</p>
        <p><strong>Notes:</strong></p>
        <ul className="list-disc list-inside mb-4">
          <li>If a player runs out of stones during their turn and cannot make a valid move, the game ends immediately.</li>
          <li>The game is played in a spirit of fairness, and strategies may include capturing stones from the opponent to gain an advantage.</li>
        </ul>
      </div>
      <div className="flex justify-center mt-4">
        <Link to={previousPath} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Back</Link>
      </div>
    </div>
  );
};

export default RulesPage;
