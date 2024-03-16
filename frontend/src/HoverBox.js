// HoverBox.js
import React from 'react';
import './HoverBox.css'; // Import CSS for styling

const HoverBox = ({ marker }) => {  return (
    <div className="hover-box">
      <h3>{marker.id}</h3>
      <p>Latitude: {marker.position.lat}</p>
      <p>Longitude: {marker.position.lng}</p>
      {/* Add more information about the marker as needed */}
    </div>
  );
};

export default HoverBox; // Export the HoverBox component as default
