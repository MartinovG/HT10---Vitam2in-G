import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import ports from "./attributed_ports"
import './Styles/Map.css';

export class MapContainer extends Component {
  state = {
    markers: [],
    clickedMarkerIds: [],
    map: null
  };

  handleMapReady = (mapProps, map) => {
    this.setState({ map });
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

  toggleMarkerSelection = (marker) => {
    this.setState(prevState => {
      const clickedMarkerIds = [...prevState.clickedMarkerIds];
      const index = clickedMarkerIds.findIndex(clickedMarker => clickedMarker.id === marker.id);
      if (index !== -1) {
        clickedMarkerIds.splice(index, 1); // Unselect marker
      } else {
        if (clickedMarkerIds.length === 2) {
          clickedMarkerIds.shift(); // Remove the first marker if there are already two selected
        }
        clickedMarkerIds.push({id: marker.id,
          lat: Math.round(marker.position.lat),
          lng: Math.round(marker.position.lng),}); // Select marker
      }
      return { clickedMarkerIds };
    }, () => {
      this.props.onMarkerClick(this.state.clickedMarkerIds);
    });
  };

  render() {
    const { start, end } = this.props.coordinates;
    return (
      <div className='Map' >
        <Map
          google={this.props.google}
          zoom={2.7}
          initialCenter={{
            lat: 0,
            lng: 0
          }}
          draggable={true}
          zoomControl={false}
          scrollwheel={true}
          disableDefaultUI={true}
          minZoom={2.7}
          onReady={this.handleMapReady}
        >
          {this.state.markers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              onClick={() => this.toggleMarkerSelection(marker)}
              icon={{
                path: window.google.maps.SymbolPath[ this.state.clickedMarkerIds.some(clickedMarker => clickedMarker.id === marker.id) ? 'PIN' : 'CIRCLE' ],
                scale: 3,
                fillColor: this.state.clickedMarkerIds.some(clickedMarker => clickedMarker.id === marker.id) ? '#0000FF' : '#FF0000',
                fillOpacity: 1,
                strokeWeight: 0
              }}
              draggable={false}
            />
          ))}
          {Array.isArray(this.props.steps) && this.props.steps.every(step => typeof step.lat === 'number' && typeof step.lng === 'number') && (
            <Polyline
              path={this.props.steps}
              strokeColor="#0000FF"
              strokeOpacity={0.8}
              strokeWeight={2}
            />
          )}
          {Array.isArray(this.props.currSteps) && this.props.currSteps.every(step => typeof step.lat === 'number' && typeof step.lng === 'number') && (
            <Polyline
              path={this.props.currSteps}
              strokeColor="#FF0000"
              strokeOpacity={0.8}
              strokeWeight={2}
              icons={[
                {
                  icon: {
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 3,
                  },
                  offset: '100%',
                },
              ]}
            />
          )}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC_jPBoHy7ZwjzJd6UnE9QSnCLhsRU-lTA'
})(MapContainer);