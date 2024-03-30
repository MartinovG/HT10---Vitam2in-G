import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import ports from "./attributed_ports"
import './Styles/Map.css';

export class MapContainer extends Component {
  state = {
    markers: [], 
    clickedMarkers: []
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
      <div className='Map'>
        <Map
          google={this.props.google}
          zoom={2.7} 
          initialCenter={{
            lat: 0, 
            lng: 0
          }}
          draggable={true}
          zoomControl={false}
          scrollwheel={false}
          disableDefaultUI={true}
          >
          {this.state.markers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              onClick={() => {
                this.setState(prevState => ({
                  clickedMarkers: [
                    ...prevState.clickedMarkers,
                    {
                      lat: Math.round(marker.position.lat),
                      lng: Math.round(marker.position.lng),
                    },
                  ],
                }), () => {
                  this.props.onMarkerClick(this.state.clickedMarkers);
                });
                this.toggleMarkerIcon(marker.id);
              }}
              icon={{
                path: window.google.maps.SymbolPath[marker.iconType.toUpperCase()],
                scale: 3,
                fillColor: marker.iconType === 'circle' ? '#FF0000' : '#0000FF',
                fillOpacity: 1,
                strokeWeight: 0
              }}
              draggable={false}/>
          ))}
          {Array.isArray(this.props.steps) && this.props.steps.every(step => typeof step.lat === 'number' && typeof step.lng === 'number') && (
            <Polyline
              path={this.props.steps}
              strokeColor="#0000FF"
              strokeOpacity={0.8}
              strokeWeight={2} />
          )}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyC_jPBoHy7ZwjzJd6UnE9QSnCLhsRU-lTA'
})(MapContainer);