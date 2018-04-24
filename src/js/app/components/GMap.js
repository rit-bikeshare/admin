import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

export default compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `500px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(({ children, mapRef, ...props }) => {
  return (
    <GoogleMap
      ref={mapRef}
      defaultZoom={17}
      defaultCenter={{ lat: 43.08447438334887, lng: -77.67920080572367 }}
      options={{
        streetViewControl: false,
      }}
      {...props}
    >
      {children}
    </GoogleMap>
  );
});
