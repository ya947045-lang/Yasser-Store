import React from 'react';

const Card = ({ children, className = '', hover = false, padding = true }) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl shadow-md 
        ${padding ? 'p-6' : ''} 
        ${hover ? 'transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
