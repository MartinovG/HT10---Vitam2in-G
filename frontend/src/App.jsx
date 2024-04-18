import React, { useState, useEffect } from "react";
import './Styles/App.css';
import MapContainer from './Map';
import Navbar from "./Navbar";

function App() {

    const [steps, setSteps] = useState([]);
    const [currSteps, setCurrSteps] = useState([]);
    const [coordinates, setCoordinates] = useState({ start: null, end: null });
    const [speed, setSpeed] = useState(null);
    const [commonSteps, setCommonSteps] = useState([]);

    const handleEnter = (start, end) => {
    setCoordinates({ start, end });
    handleCurrent(start, end);
  };

    const handleSpeedEnter = (speed) => {
      setSpeed(speed);
      handleSpeed(speed);
    };

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

  const handleCurrent = (start, end) => {
    fetch('http://localhost:8000/current', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([ start, end ]),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      const formattedSteps = data.steps.map(step => ({
        lat: step.x, 
        lng: step.y
      }));
      setCurrSteps(formattedSteps);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleSpeed = (speed) => {
    fetch('http://localhost:8000/speed', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ speed }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  useEffect(() => {
    const newCommonSteps = steps.filter(step => 
      currSteps.some(currStep => currStep.lat === step.lat && currStep.lng === step.lng)
    );
    setCommonSteps(newCommonSteps);
  
    console.log('CommonSteps:', newCommonSteps);
  
    if (steps.length > 0 && currSteps.length > 0) {
      const startOfCurrent = currSteps[0];
      const startOfCurrentIndexInSteps = steps.findIndex(step => step.lat === startOfCurrent.lat && step.lng === startOfCurrent.lng);
      const endOfCurrent = currSteps[currSteps.length - 1];
      const endOfCurrentIndexInSteps = steps.findIndex(step => step.lat === endOfCurrent.lat && step.lng === endOfCurrent.lng);
  
      if (startOfCurrentIndexInSteps !== -1) {
        console.log('Distance from start of path to start of current:', startOfCurrentIndexInSteps);
      }
  
      if (endOfCurrentIndexInSteps !== -1) {
        console.log('Distance from start of path to end of current:', endOfCurrentIndexInSteps);
      }

      if (startOfCurrentIndexInSteps !== -1 && endOfCurrentIndexInSteps !== -1) {
        if (startOfCurrentIndexInSteps > endOfCurrentIndexInSteps) {
          console.log('The current path is reversed');
        } else {
          console.log('The current path is right');
        }
      }

    }
  }, [steps, currSteps]);

  return (
    <div className="App">
      <MapContainer steps={steps} currSteps={currSteps} coordinates={coordinates} onMarkerClick={handleClickedMarkers} />
      <Navbar onEnter={handleEnter} onSpeed={handleSpeedEnter}/> 
    </div>
  );
}

export default App;