import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends React.Component {
  state = {
    markers: [],
    activeMarker: {},
    showingInfoWindow: false
  };

  onMapClicked = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    let newMarker = { id: Date.now(), position: { lat, lng } };

    if (this.state.markers.length === 0) {
      newMarker.color = 'red'; 
    } else if (this.state.markers.length === 1) {
      newMarker.color = 'blue'; 
    } else {
      return; 
    }

    this.setState(prevState => ({
      markers: [...prevState.markers, newMarker],
      activeMarker: newMarker,
      showingInfoWindow: true
    }));
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
    });
  }

  onInfoWindowClose = () => {
    this.setState({
      showingInfoWindow: false
    });
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
            onClick={this.onMarkerClick}
            icon={{
              url: `http://maps.google.com/mapfiles/ms/icons/${marker.color}-dot.png`
            }}
          />
        ))}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onInfoWindowClose}
        >
          <div>
            <h4>Cordinats</h4>
            <p>temperature: </p>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDH-sasWgSV-BecVcLrmjWd6Mvos66X1bE'
})(MapContainer);