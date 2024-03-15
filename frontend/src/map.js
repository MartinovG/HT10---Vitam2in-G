import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import Menu from './Menu';
import ports from './attributed_ports';

const mapStyles = {
  width: '100%',
  height: '100%'
};



export class MapContainer extends Component {
  state = {
    markers: [],
    selectedMarkers: [],
    lines: [],
    isMenuOpen: false,
    selectedMarkersCoordinates: null,
    greenPointPosition: null,
    selectedMenuOption: null
  };

  componentDidMount() {
    const markers = ports.features.map(feature => ({
      id: feature.properties.LOCODE,
      position: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      },
      iconType: 'circle'
    }));
    this.setState({ markers });
  }

  toggleMenu = () => {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen
    }));
  };

  handleMarkerClick = (marker) => {
    const { selectedMarkers, selectedMenuOption } = this.state;

    this.setState({ selectedMenuOption: marker.id });

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
          selectedMarkersCoordinates: {
            marker1: selectedMarkers[0].position,
            marker2: marker.position
          }
        }));

        setTimeout(() => {
          this.animateGreenPoint(selectedMarkers[0].position, marker.position);
        }, 1000);
      }
    }
  }

  animateGreenPoint = (startPosition, endPosition) => {
    let startTime = null;
    const duration = 40000;

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

  // Function to toggle marker icon
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
  };

  render() {
    const { greenPointPosition, isMenuOpen, selectedMenuOption } = this.state;
    const waterArrows = [
      { lat: 30, lng: -100 },
      { lat: 35, lng: -110 }, 
    ];
  
    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Menu isOpen={isMenuOpen} />

        <div style={{ flex: 1 }}>
          <Map
            google={this.props.google}
            zoom={1.2}
            style={mapStyles}
            initialCenter={{
              lat: 0,
              lng: 0
            }}
            minZoom={1}
            styles={[
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [
                  { color: '#e9e9e9' }
                ]
              },
            ]}
          >
            {this.state.markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={{
                  path: window.google.maps.SymbolPath[marker.iconType.toUpperCase()],
                  scale: 3,
                  fillColor: marker.iconType === 'circle' ? '#FF0000' : '#0000FF',
                  fillOpacity: 1,
                  strokeWeight: 0
                }}
                onClick={() => this.handleMarkerClick(marker)}
                draggable={true} 
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

            {selectedMenuOption === 'current' && waterArrows.map((arrow, index) => (
              <Marker
                key={index}
                position={arrow}
                icon={{
                  path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 5,
                  fillColor: 'blue',
                  fillOpacity: 1,
                  strokeWeight: 0
                }}
              />
            ))}
          </Map>
        </div>
  
        <button
          onClick={this.toggleMenu}
          style={{ position: 'absolute', top: '20px', left: '20px', zIndex: '999' }}
        >
          ☰
        </button>
      </div>
    );
  }
}  

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDH-sasWgSV-BecVcLrmjWd6Mvos66X1bE'
})(MapContainer);
