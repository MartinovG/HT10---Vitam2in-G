import { useState, useEffect } from 'react';
import './Styles/Navbar.css';

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

  return (
    <nav className="navbar">
        <h1>SailRoute</h1>
        <img id="logo" src="/Logo.png" alt="Logo" />
        <p id="distance">Total distance: {totalDistance} km</p>
    </nav>
  );
}