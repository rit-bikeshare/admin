import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

//eslint-disable-next-line
const init = map => {
  //map.fitBounds({ east: -77.67, north: 43.09, south: 43.08, west: -77.69 });
};

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
)(({ markers }) => {
  return (
    <GoogleMap
      ref={init}
      defaultZoom={17}
      zoom={17}
      center={{ lat: 43.08447438334887, lng: -77.67920080572367 }}
      options={{
        streetViewControl: false,
      }}
    >
      {markers.toList()}
    </GoogleMap>
  );
});

const MarkerMap = ({ markers }) => {
  return <MyMapComponent markers={markers} />;
};

MarkerMap.propTypes = {
  markers: PropTypes.object,
};

export default MarkerMap;
