import React from 'react';

const CustomButton = ({ onClick, label, colorClass }) => {
  return (
    <button
      className={`navbar-toggler align-self-center text-white btn ${colorClass}`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default CustomButton;
