import React, { useState } from 'react';
import './Menu.css'; // Importing the CSS file

const Menu = ({ isOpen, onCurrentsButtonClick, onAddCurrentButtonClick, onRemoveCurrentButtonClick, onWaveButtonClick, onAddWaveButtonClick, onRemoveWaveButtonClick, showCurrents, showWaves, onRemoveSelected }) => {
  const [isAddCurrentVisible, setAddCurrentVisible] = useState(false);
  const [isAddWaveVisible, setAddWaveVisible] = useState(false);

  const handleCurrentsButtonClick = () => {
    onCurrentsButtonClick();
    setAddCurrentVisible(!showCurrents); // Toggle visibility based on showCurrents
  };

  const handleWaveButtonClick = () => {
    onWaveButtonClick();
    setAddWaveVisible(!showWaves); // Toggle visibility based on showWaves
  };

  return (
    <div className="menu-container" style={{ width: isOpen ? '200px' : '0' }}>
      <div className="menu-overlay"></div> {/* New overlay for background color */}
      <div className="menu-content">
        <div className="menu-item">
          <button onClick={handleCurrentsButtonClick}>
            {showCurrents ? "Hide Currents" : "Add Currents"} {/* Modified to show "Add Currents" if currents are not visible */}
          </button>
        </div>

        {showCurrents && ( // Render only if showCurrents is true
          <div className="menu-item">
            <button onClick={onAddCurrentButtonClick}>
              Add Current
            </button>
          </div>
        )}

        <div className="menu-item">
          <button onClick={handleWaveButtonClick}>
            {showWaves ? "Hide Waves" : "Add Waves"} {/* Modified to show "Add Waves" if waves are not visible */}
          </button>
        </div>

        {showWaves && ( // Render only if showWaves is true
          <div className="menu-item">
            <button onClick={onAddWaveButtonClick}> {/* Use onAddWaveButtonClick here */}
              Add Wave
            </button>
          </div>
        )}

        <div className="menu-item">
          <button onClick={onRemoveSelected}>
            Remove Selected
          </button>
        </div>
      </div>

      {/* Menu items below the menu content */}
      <div className="additional-items">
        {/* Additional items go here */}
      </div>
    </div>
  );
};

export default Menu;
