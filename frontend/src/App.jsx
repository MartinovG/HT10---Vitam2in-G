import React, { useState, useEffect } from "react";
import './Styles/App.css';
import MapContainer from './Map';
import Navbar from "./Navbar";

function App() {

  const [steps, setSteps] = useState([]);

  const handleClickedMarkers = (clickedMarkers) => {
    fetch('http://localhost:8000/clicked-markers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickedMarkers),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      const formattedSteps = data.steps.map(step => ({
        lat: step.x, 
        lng: step.y
      }));
      setSteps(formattedSteps);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  
  return (
    <div className="App">
      <MapContainer steps={steps} onMarkerClick={handleClickedMarkers} />
      <Navbar />
    </div>
  );
}

export default App;