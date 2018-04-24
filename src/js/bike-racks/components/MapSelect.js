/* global google */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS, List, Map } from 'immutable';
import { Polygon } from 'react-google-maps';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';
import GMap from 'app/components/GMap';
import BikeRackMarker from './BikeRackMarker';
import { record as BikeRack } from '../redux/bikeRacks';

class MapSelect extends Component {
  constructor(props) {
    super(props);
    this.registerMapRef = this.registerMapRef.bind(this);
  }

  registerMapRef(ref) {
    this.map = ref;
  }

  renderBikeRackMarker(bikeRack) {
    if (!bikeRack.lat || !bikeRack.lon) {
      return null;
    }

    return <BikeRackMarker bikeRack={bikeRack} />;
  }

  renderBikeRackCheckOutArea(bikeRack) {
    if (!bikeRack.checkInArea) {
      return null;
    }

    const coords = bikeRack.checkInArea
      .get('coordinates')
      .first()
      .toJS();

    const formattedCoords = coords.map(coord => ({
      lat: coord[1],
      lng: coord[0],
    }));

    return (
      <Polygon
        paths={formattedCoords}
        options={{
          fillColor: 'rgba(243,110,31,0.25)',
          strokeColor: 'rgba(243,110,31,0.5)',
        }}
      />
    );
  }

  renderMap() {
    const { bikeRack, onChange } = this.props;
    const markers = List([
      this.renderBikeRackMarker(bikeRack),
      this.renderBikeRackCheckOutArea(bikeRack),
    ]);

    const center =
      bikeRack.lat && bikeRack.lon
        ? { lat: bikeRack.lat, lng: bikeRack.lon }
        : { lat: 43.08447438334887, lng: -77.67920080572367 };

    return (
      <GMap mapRef={ref => this.registerMapRef(ref)} defaultCenter={center}>
        <DrawingManager
          defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
          defaultOptions={{
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                google.maps.drawing.OverlayType.POLYGON,
                google.maps.drawing.OverlayType.MARKER,
              ],
            },
            polygonOptions: {
              fillColor: 'rgba(243,110,31,0.8)',
              strokeColor: 'rgba(0, 0, 0,0.8)',
            },
          }}
          onPolygonComplete={p => {
            const coordinates = List([
              fromJS(p.latLngs.b[0].b).map(k => List([k.lng(), k.lat()])),
            ]);
            p.setMap(null);
            onChange(
              bikeRack.set('checkInArea', Map({ coordinates, type: 'Polygon' }))
            );
          }}
          onMarkerComplete={m => {
            const lat = m.position.lat();
            const lon = m.position.lng();
            m.setMap(null);
            onChange(bikeRack.set('lat', lat).set('lon', lon));
          }}
        />
        {markers}
      </GMap>
    );
  }

  render() {
    return this.renderMap();
  }
}

MapSelect.propTypes = {
  bikeRack: PropTypes.instanceOf(BikeRack),
  onChange: PropTypes.func.isRequired,
};

export default MapSelect;
