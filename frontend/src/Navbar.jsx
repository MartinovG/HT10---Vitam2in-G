import { useState, useEffect } from 'react';
import './Styles/Navbar.css';
import Draggable from './Drag';

export default function Navbar() {
  const [totalDistance, setTotalDistance] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8000/totalDistance');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTotalDistance(data.totalDistance);
    };

  return () => {
      eventSource.close();
    };
  }, []);
  
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'Draggable');
  };

  return (
    <nav className="navbar">
      <h1>SailRoute</h1>
      <img id="logo" src="/Logo.png" alt="Logo" />
      <p id="distance">Total distance: {totalDistance} km</p>
      <Draggable initialPos={{x: 35, y: 80}} onDragStart={handleDragStart}>
        ^
      </Draggable>
    </nav>
  );
}