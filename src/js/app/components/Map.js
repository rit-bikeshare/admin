import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(({ markers, mapRef }) => {
  return (
    <GoogleMap
      ref={mapRef}
      defaultZoom={17}
      defaultCenter={{ lat: 43.08447438334887, lng: -77.67920080572367 }}
      options={{ streetViewControl: false }}
    >
      {markers.toList()}
    </GoogleMap>
  );
});

const MarkerMap = ({ markers, mapRef }) => {
  return <MyMapComponent mapRef={mapRef} markers={markers} />;
};

MarkerMap.propTypes = {
  markers: PropTypes.object,
  mapRef: PropTypes.func,
};

export default MarkerMap;
