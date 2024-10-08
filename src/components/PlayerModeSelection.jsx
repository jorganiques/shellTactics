// Start - PlayerModeSelection.jsx
import React, { useState, useEffect } from 'react';
import { useGameDispatch } from './SungkaGameContext';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/SungkaBackground.jpg';  

const PlayerModeSelection = () => {
  const dispatch = useGameDispatch();
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const apiUrl = 'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en';

        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const quoteData = JSON.parse(data.contents); 

        const cleanedQuote = quoteData.quoteText.replace(/\\'/g, "'"); // Fix escaped single quotes
        setQuote(`${cleanedQuote} - ${quoteData.quoteAuthor}`);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote('Sorry, quotes are currently unavailable.');
      }
    };

    fetchQuote();
  }, []);

  const handleModeSelect = (mode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  return (
    <div
      className="flex flex-col items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1 className="text-5xl font-bold mb-8 text-gold">Welcome to ShellTactics</h1>
      
      {quote && (
        <div className="text-2xl italic text-yellow-200 mb-6 px-4 text-center">
          "{quote}"
        </div>
      )}
      
      <Link to="/rules" state={{ from: location.pathname }} className="text-4xl px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mt-4 mb-6">
        Rules
      </Link>
      <h2 className="text-3xl font-bold mb-8 text-cream">Select Player Mode</h2>
      <Link to="/one-player" onClick={() => handleModeSelect('one-player')}>
        <button className="mb-4 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700">Single Player</button>
      </Link>
      <Link to="/two-players" onClick={() => handleModeSelect('two-players')}>
        <button className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-700">Two Players</button>
      </Link>
    </div>
  );
};

export default PlayerModeSelection;

// End - PlayerModeSelection.jsx
