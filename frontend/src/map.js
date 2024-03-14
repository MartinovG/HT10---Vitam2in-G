import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import ports from "./attributed_ports";

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {
  state = {
    markers: [],
    selectedMarkers: [],
    lines: [],
    selectedMarkersCoordinates: null, // To store the coordinates of the selected markers
    greenPointPosition: null // To store the position of the green point
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
    let updatedMarkers = this.state.markers.map(marker => {
      if (marker.id === id) {
        return {
          ...marker,
          iconType: marker.iconType === 'circle' ? 'pin' : 'circle'
        };
      }
      return marker;
    });

    this.setState({ markers: updatedMarkers });
  }

  handleMarkerClick = (marker) => {
    const { selectedMarkers } = this.state;

    if (selectedMarkers.length < 2) {
      this.setState(prevState => ({
        selectedMarkers: [...prevState.selectedMarkers, marker]
      }));

      this.toggleMarkerIcon(marker.id);

      if (selectedMarkers.length === 1) {
        const newLine = [
          selectedMarkers[0].position,
          marker.position
        ];

        this.setState(prevState => ({
          lines: [...prevState.lines, newLine],
          selectedMarkersCoordinates: { // Create object with coordinates of the selected markers
            marker1: selectedMarkers[0].position,
            marker2: marker.position
          }
        }));

        setTimeout(() => {
          this.animateGreenPoint(selectedMarkers[0].position, marker.position);
        }, 1000); // Delay the animation start by 1 second (1000 milliseconds)
      }
    }
  }

  animateGreenPoint = (startPosition, endPosition) => {
    let startTime = null;
    const duration = 5000; // Animation duration in milliseconds (5 seconds)

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      const newPosition = {
        lat: this.easeInOutQuad(progress, startPosition.lat, endPosition.lat - startPosition.lat, duration),
        lng: this.easeInOutQuad(progress, startPosition.lng, endPosition.lng - startPosition.lng, duration)
      };

      this.setState({ greenPointPosition: newPosition });

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  render() {
    const { greenPointPosition } = this.state;

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
            onClick={() => this.handleMarkerClick(marker)}
            draggable={true} // Allow markers to be draggable
          />
        ))}

        {this.state.lines.map((line, index) => (
          <Polyline
            key={index}
            path={line}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
          />
        ))}

        {greenPointPosition && (
          <Marker
            position={greenPointPosition}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 5,
              fillColor: 'green',
              fillOpacity: 1,
              strokeWeight: 0
            }}
          />
        )}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDH-sasWgSV-BecVcLrmjWd6Mvos66X1bE'
})(MapContainer);
