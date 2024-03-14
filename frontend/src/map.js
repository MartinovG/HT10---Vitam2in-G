import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import ports from "./attributed_ports"
const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {
  state = {
    markers: []
  };

  componentDidMount() {
    // Extract coordinates from the data and create markers
    const markers = ports.features.map(feature => ({
      id: feature.properties.LOCODE,
      position: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      },
      color: 'red' // Assuming all markers are red initially
    }));
    this.setState({ markers });
  }

  onMapClicked = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    let newMarker = { id: Date.now(), position: { lat, lng } };

    this.setState(prevState => ({
      markers: [...prevState.markers, newMarker]
    }));
  }

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={1.2} 
        style={mapStyles}
        initialCenter={{
          lat: 0, 
          lng: 0
        }}
        minZoom={1}
        onClick={this.onMapClicked}
        >
        {this.state.markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 3, // Adjust the scale to change the size of the point
              fillColor: '#FF0000',
              fillOpacity: 1,
              strokeWeight: 0
            }}
          />
        ))}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDH-sasWgSV-BecVcLrmjWd6Mvos66X1bE'
})(MapContainer);
