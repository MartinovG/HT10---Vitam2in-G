import React from 'react';
import { Map, Marker } from 'google-maps-react';

const WaterOnlyOverlay = ({ children, ...props }) => {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (mapRef.current && mapRef.current.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      const map = mapRef.current.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      const bounds = new map.maps.LatLngBounds();

      map.data.addListener('addfeature', () => {
        const features = map.data.getFeatures();
        features.forEach((feature) => {
          if (feature.getGeometry().getType() === 'Polygon') {
            bounds.union(feature.getBounds());
          }
        });
        map.fitBounds(bounds);
      });

      map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google-maps-samples/data/geojson/polygon-samples/simple-polygons.geojson');

      map.addListener('click', (event) => {
        if (!bounds.contains(event.latLng)) {
          event.stop();
        }
      });
    }
  }, [mapRef]);

  return <Map ref={mapRef} {...props} />;
};

export default WaterOnlyOverlay;