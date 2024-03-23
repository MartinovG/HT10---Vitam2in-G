import React, { useState, useEffect } from "react";
import './App.css';
import MapContainer from './Map';

function App() {

  const [steps, setSteps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000")
      .then((res) => res.json())
      .then((data) => {
        const formattedSteps = data.steps.flat().map(step => ({
          lat: step.x, 
          lng: step.y
        }));
        setSteps(formattedSteps);
      });
  }, []);

  console.log(steps)

  return (
    <div className="App">
      <MapContainer steps={steps} />
    </div>
  );
}

export default App;