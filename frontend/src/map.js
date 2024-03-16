import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline, InfoWindow } from 'google-maps-react';
import Menu from './Menu';
import ports from './attributed_ports';
import waveImage from './wave.png';
import ship from './ship.png';

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
    selectedMenuOption: null,
    selectedMarkersCoordinates: null,
    greenPointPosition: null,
    showCurrents: false,
    showWaves: false,
    waterArrows: [
      { id: 1, position: { lat: 10, lng: -20 }, rotation: 0 },
      { id: 2, position: { lat: 50, lng: -30 }, rotation: 0 }
    ],
    waterWaves: [
      { id: 1, position: { lat: 30, lng: -20 } },
      { id: 2, position: { lat: 60, lng: -30 } }
    ],
    selectedArrowIndex: -1,
    selectedWaveIndex: -1,
    animationRunning: true,
    animationPaused: false
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

    window.addEventListener('keydown', this.handleArrowRotation);
    window.addEventListener('keydown', this.handleSpaceKey); // Add event listener for space key
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleArrowRotation);
    window.removeEventListener('keydown', this.handleSpaceKey); // Remove event listener for space key
  }

  toggleAnimation = () => {
    this.setState(prevState => ({
      animationRunning: !prevState.animationRunning
    }));
  };

  handleSpaceKey = event => {
    if (event.key === ' ') { // Check if space key is pressed
      this.setState(prevState => ({
        animationPaused: !prevState.animationPaused
      }));
    }
  };

  

  toggleMenu = () => {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen,
      selectedMenuOption: null
    }));
  };
  

  handleMarkerClick = marker => {
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
          selectedMarkersCoordinates: {
            marker1: selectedMarkers[0].position,
            marker2: marker.position
          }
        }));

        setTimeout(() => {
          this.animateGreenPoint(
            selectedMarkers[0].position,
            marker.position
          );
        }, 1000);
      }
    }
  };

  animateGreenPoint = (startPosition, endPosition) => {
    let startTime = null;
    const duration = 40000;
  
    const animate = timestamp => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
  
      if (!this.state.animationPaused) { // Check if animation is not paused
        const newPosition = {
          lat: this.easeInOutQuad(
            progress,
            startPosition.lat,
            endPosition.lat - startPosition.lat,
            duration
          ),
          lng: this.easeInOutQuad(
            progress,
            startPosition.lng,
            endPosition.lng - startPosition.lng,
            duration
          )
        };
  
        this.setState({ greenPointPosition: newPosition });
      }
  
      if (progress < duration && this.state.animationRunning) { // Check if animation is running
        requestAnimationFrame(animate);
      }
    };
  
    requestAnimationFrame(animate);
  };

  easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  toggleMarkerIcon = id => {
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

  handleCurrentsButtonClick = () => {
    this.setState(prevState => ({
      showCurrents: !prevState.showCurrents,
      selectedMenuOption: prevState.showCurrents ? null : 'current'
    }));
  };

  handleWavesButtonClick = () => {
    this.setState(prevState => ({
      showWaves: !prevState.showWaves,
      selectedMenuOption: prevState.showWaves ? null : 'wave'
    }));
  };

  handleAddCurrentButtonClick = () => {
    const newId = this.state.waterArrows.length + 1;
    const newPosition = {
      lat: 20,
      lng: -120
    };
    const newCurrent = { id: newId, position: newPosition, rotation: 0 };
    this.setState(prevState => ({
      waterArrows: [...prevState.waterArrows, newCurrent]
    }));
  };

  handleAddWaveButtonClick = () => {
    const newId = this.state.waterWaves.length + 1;
    const newPosition = {
      lat: 40,
      lng: -30
    };
    const newWave = { id: newId, position: newPosition };
    this.setState(prevState => ({
      waterWaves: [...prevState.waterWaves, newWave]
    }));
  };

  handleCurrentMarkerDrag = (markerId, newPosition) => {
    const updatedWaterArrows = this.state.waterArrows.map(arrow => {
      if (arrow.id === markerId) {
        return {
          ...arrow,
          position: newPosition
        };
      }
      return arrow;
    });
    this.setState({ waterArrows: updatedWaterArrows });
  };
  handleWaveMarkerDrag = (markerId, newPosition) => {
    const updatedWaterWaves = this.state.waterWaves.map(wave => {
      if (wave.id === markerId) {
        return {
          ...wave,
          position: newPosition
        };
      }
      return wave;
    });
    this.setState({ waterWaves: updatedWaterWaves });
  };

  handleArrowRotation = event => {
    const { key } = event;
    const { waterArrows, selectedArrowIndex } = this.state;

    const rotationStep = 10;

    if (selectedArrowIndex === -1) return;

    const updatedWaterArrows = [...waterArrows];

    switch (key) {
      case 'a':
        updatedWaterArrows[selectedArrowIndex].rotation -= rotationStep;
        break;
      case 'd':
        updatedWaterArrows[selectedArrowIndex].rotation += rotationStep;
        break;
      default:
        break;
    }

    updatedWaterArrows[selectedArrowIndex].rotation =
      (updatedWaterArrows[selectedArrowIndex].rotation + 360) % 360;

    this.setState({ waterArrows: updatedWaterArrows });
  };

  handleArrowSelect = arrowIndex => {
    this.setState({ selectedArrowIndex: arrowIndex });
  };
  
  handleWaveSelect = waveIndex => {
    this.setState({ selectedWaveIndex: waveIndex });
  };
  
  handleRemoveSelected = () => {
    const { selectedArrowIndex, selectedWaveIndex, waterArrows, waterWaves } = this.state;
  
    if (selectedArrowIndex !== -1) {
      const updatedWaterArrows = [...waterArrows];
      updatedWaterArrows.splice(selectedArrowIndex, 1);
      this.setState({ waterArrows: updatedWaterArrows, selectedArrowIndex: -1 });
    }
  
    if (selectedWaveIndex !== -1) {
      const updatedWaterWaves = [...waterWaves];
      updatedWaterWaves.splice(selectedWaveIndex, 1);
      this.setState({ waterWaves: updatedWaterWaves, selectedWaveIndex: -1 });
    }
  };
  
  render() {
    const {
      greenPointPosition,
      isMenuOpen,
      showCurrents,
      showWaves,
      waterArrows,
      waterWaves,
      selectedMarkers,
      animationRunning // Added animationRunning state variable
    } = this.state;

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <Menu
          isOpen={isMenuOpen}
          onCurrentsButtonClick={this.handleCurrentsButtonClick}
          onAddCurrentButtonClick={this.handleAddCurrentButtonClick}
          onRemoveCurrentButtonClick={this.handleRemoveCurrentsButtonClick}
          onWaveButtonClick={this.handleWavesButtonClick}
          onAddWaveButtonClick={this.handleAddWaveButtonClick}
          showCurrents={showCurrents}
          showWaves={showWaves}
          onRemoveSelected={this.handleRemoveSelected}
        />

        <div style={{ flex: 1 }}>
          <Map
            google={this.props.google}
            zoom={2}
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
                stylers: [{ color: '#00BFFF' }]
              }
            ]}
            mapTypeControl={false}
          >
            {this.state.markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={{
                  path: window.google.maps.SymbolPath[marker.iconType.toUpperCase()],
                  scale: 3,
                  fillColor:
                    marker.iconType === 'circle' ? '#FF0000' : '#0000FF',
                  fillOpacity: 1,
                  strokeWeight: 0
                }}
                onClick={() => this.handleMarkerClick(marker)}
              >
                <InfoWindow>
                  <div>
                    {/* Content to display in the InfoWindow */}
                    Port Information
                  </div>
                </InfoWindow>
              </Marker>
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
                  url: ship,
                  scaledSize: new this.props.google.maps.Size(50, 50),
                  scale: 5,
                  fillColor: 'green',
                  fillOpacity: 1,
                  strokeWeight: 0
                }}
              />
            )}

            {showCurrents && waterArrows.map((arrow, index) => (
              <Marker
                key={arrow.id}
                position={arrow.position}
                draggable={true}
                onDragend={(t, map, coord) =>
                  this.handleCurrentMarkerDrag(arrow.id, {
                    lat: coord.latLng.lat(),
                    lng: coord.latLng.lng()
                  })
                }
                icon={{
                  path: 'M 0,-5 L -2,3 L 0,1 L 2,3 Z',
                  scale: 2,
                  strokeColor: 'blue',
                  strokeWeight: 2,
                  rotation: arrow.rotation
                }}
                onClick={() => this.handleArrowSelect(index)}
              />
            ))}

            {showWaves && waterWaves.map((wave, index) => (
              <Marker
                key={wave.id}
                position={wave.position}
                draggable={true}
                onDragend={(t, map, coord) =>
                  this.handleWaveMarkerDrag(wave.id, {
                    lat: coord.latLng.lat(),
                    lng: coord.latLng.lng()
                  })
                }
                icon={{
                  url: waveImage,
                  scaledSize: new this.props.google.maps.Size(50, 50)
                }}
                onClick={() => this.handleWaveSelect(index)}
              />
            ))}
          </Map>
      </div>

      <button
  onClick={this.toggleMenu}
  style={{
    color: 'black',
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: '999',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontSize: '24px'
  }}
>
  ☰
</button>

    </div>    
  );
}
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBfMGCbFUHFAeVhvIWAFHOkRbNS9JcCNNc'
})(MapContainer);