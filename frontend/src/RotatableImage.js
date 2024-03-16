import React from 'react';

const RotatableImage = ({ src, rotation }) => {
  const style = {
    transform: `rotate(${rotation}deg)`, // Apply rotation transformation
  };

  return <img src={src} alt="Rotatable" style={style} />;
};

export default RotatableImage;
