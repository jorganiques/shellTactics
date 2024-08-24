// Start - App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './components/SungkaGameContext'; // Import from correct file
import GameContent from './components/GameContent';
import SungkaBoard from './components/SungkaBoard';
import RulesPage from './components/RulesPage';

const App = () => {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GameContent />} />
          <Route path="/one-player" element={<SungkaBoard mode="one-player" />} />
          <Route path="/two-players" element={<SungkaBoard mode="two-players" />} />
          <Route path="/rules" element={<RulesPage />} />
        </Routes>
      </Router>
    </GameProvider>
  );
};

export default App;



// End - App.jsx
