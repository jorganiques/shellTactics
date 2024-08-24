// Controls.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Controls = ({ onReset }) => {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Home</Link>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Reset
      </button>
    </div>
  );
};

export default Controls;
// Controls.jsx

