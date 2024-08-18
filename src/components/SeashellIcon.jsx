// src/components/SeashellIcon.jsx
import React from 'react';
import SungkaShell from '../assets/SungkaShell.png';

const SeashellIcon = ({ imageSrc }) => (
  <img src={imageSrc} alt="Seashell" className="w-full h-full object-cover rounded-full" />
);

export default SeashellIcon;
