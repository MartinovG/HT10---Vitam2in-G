import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react';
import ports from "./attributed_ports"
import './Styles/Map.css';

export class MapContainer extends Component {
  state = {
    markers: [], 
    clickedMarkers: [],
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

  handleDragOver = (e) => {
    e.preventDefault();
  };

  
  handleMapReady = (mapProps, map) => {
    this.setState({ map });
  };

  handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    if (data === 'Draggable' && this.state.map) {
      const google = this.props.google;
      const point = new google.maps.Point(e.clientX, e.clientY);
      const latLng = this.state.map.getProjection().fromContainerPixelToLatLng(point);
      this.setState(prevState => ({
        markers: [...prevState.markers, {
          id: `new-${Date.now()}`,
          position: {
            lat: latLng.lat(),
            lng: latLng.lng()
          },
          iconType: 'circle'
        }]
      }));
    }
  };

  render() {
    return (
      <div className='Map' onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
        <Map
          ref={this.mapRef}
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
          onClick={() => {
            if (this.state.clickedMarkers.length === 2) {
              this.setState(prevState => ({
                clickedMarkers: [],
                markers: prevState.markers.map(m => {
                  if (prevState.clickedMarkers.find(cm => cm.lat === m.position.lat && cm.lng === m.position.lng)) {
                    return { ...m, iconType: 'circle' };
                  }
                  return m;
                })
              }));
            }
            this.setState(prevState => ({
              clickedMarkers: [
                ...prevState.clickedMarkers,
                {
                  lat: Math.round(marker.position.lat),
                  lng: Math.round(marker.position.lng),
                },
              ],
              markers: prevState.markers.map(m => {
                if (m.id === marker.id) {
                  return { ...m, iconType: 'pin' };
                }
                return m;
              })
            }), () => {
              this.props.onMarkerClick(this.state.clickedMarkers);
            });
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