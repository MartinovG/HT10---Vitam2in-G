// Button.js
import React from 'react';

function Button() {
  function changeBackground(e) {
    e.target.style.background = 'red';
  }

  function revertBackground(e) {
    e.target.style.background = '';
  }

  return (
    <div>
      <button onMouseOver={changeBackground} onMouseOut={revertBackground}>
        Hover over me!
      </button>
    </div>
  );
}

export default Button;
