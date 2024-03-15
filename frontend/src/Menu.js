import React from 'react';

const Menu = ({ isOpen }) => {
  return (
    <div
      style={{
        width: isOpen ? '200px' : '0',
        overflow: 'hidden',
        transition: 'width 0.3s'
      }}    
    >
      <div style={{ backgroundColor: 'lightgray', padding: '20px' }}>
        <a href="/temp.mp4" target="_blank">
          <ul>Temperature</ul>
        </a>
      </div>

      <div style={{ backgroundColor: 'lightgray', padding: '20px' }}>
        <a href="/curr.mp4" target="_blank">
          <ul>Currents</ul>
        </a>
      </div>
      <div style={{ backgroundColor: 'lightgray', padding: '20px' }}>
        <a href="/curr.mp4" target="_blank">
          <ul>Waves</ul>
        </a>
      </div>
    </div>
  );
};

export default Menu;
