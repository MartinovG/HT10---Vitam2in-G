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
    const markers = ports.features.map(feature => ({
      id: feature.properties.LOCODE,
      position: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      },
      iconType: 'circle' // Assuming all markers start with a circle icon
    }));
    this.setState({ markers });
  }

  toggleMarkerIcon = (id) => {
    this.setState(prevState => ({
      markers: prevState.markers.map(marker => {
        if (marker.id === id) {
          return {
            ...marker,
            iconType: marker.iconType === 'circle' ? 'pin' : 'circle'
          };
        }
        return marker;
      })
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
        onClick={() => {}}
      >
        {this.state.markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={{
              path: window.google.maps.SymbolPath[marker.iconType.toUpperCase()],
              scale: 3, // Adjust the scale to change the size of the point
              fillColor: marker.iconType === 'circle' ? '#FF0000' : '#0000FF', // Circle or Pin color
              fillOpacity: 1,
              strokeWeight: 0
            }}
            onClick={() => this.toggleMarkerIcon(marker.id)}
            draggable={true} // Allow markers to be draggable
          />
        ))}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDH-sasWgSV-BecVcLrmjWd6Mvos66X1bE'
})(MapContainer);
