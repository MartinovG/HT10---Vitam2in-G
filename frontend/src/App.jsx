import React, { useState, useEffect } from "react";
import './Styles/App.css';
import MapContainer from './Map';
import Navbar from "./Navbar";

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
      <Navbar />
    </div>
  );
}

export default App;