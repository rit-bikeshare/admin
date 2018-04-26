import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import { Marker, Polygon } from 'react-google-maps';
import {
  Container,
  Table,
  Button,
  Loader,
  Header,
  Modal,
} from 'semantic-ui-react';
import BoolIcon from 'lib/components/BoolIcon';
import GMap from 'app/components/GMap';
import DeleteModal from 'app/components/DeleteModal';
import BikeEditor from './BikeEditor';
import generateQRCode from '../../lib/generateQRCode';
import {
  name as objectName,
  record as Bike,
  bikesListAction,
  bikesRetrieveAction,
  bikesDestroyAction,
} from '../redux/bikes';
import { bikeRacksListAction } from 'bike-racks/redux/bikeRacks';
import { openBikeEditor } from '../redux/bikeEditor';

class BikesView extends Component {
  constructor(props) {
    super(props);
    this.state = { deleteBikeModal: null, pollForUpdates: false, qrCode: null };
    this.handleQRModalClose = this.handleQRModalClose.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.pollTimeout);
  }

  componentWillMount() {
    const { bikesList, bikeRacksList } = this.props;
    bikesList();
    bikeRacksList();
    this.pollTimeout = setInterval(() => bikesList(), 5000);
  }

  registerMapRef(ref) {
    this.map = ref;
  }

  handleQRModalClose() {
    this.setState({ qrCode: null });
  }

  async showQRCodeModal(bike) {
    const qrCode = await generateQRCode(bike);
    this.setState({ qrCode });
  }

  renderQRCodeModal() {
    const { qrCode } = this.state;
    if (!qrCode) return null;

    return (
      <Modal onClose={this.handleQRModalClose} open={true} closeIcon={true}>
        <Modal.Header>QR Code</Modal.Header>
        <Modal.Content>
          <p>
            Download this image and change the dpi to be 300 before printing.
          </p>
          <img
            alt="qr code"
            src={qrCode}
            style={{
              width: 615,
              height: 350,
              margin: 'auto',
              display: 'block',
            }}
          />
        </Modal.Content>
      </Modal>
    );
  }

  renderDeleteBikeModal() {
    const { deleteBikeModal: id } = this.state;
    return id ? (
      <DeleteModal
        id={id}
        objectName={objectName}
        deleteFn={this.props.bikesDestroy}
        onDelete={() => this.setState({ deleteBikeModal: null })}
        onCancel={() => this.setState({ deleteBikeModal: null })}
      />
    ) : null;
  }

  renderBike(bike) {
    const { openEditor } = this.props;
    const {
      id,
      visible,
      currentRenterUsername,
      lat,
      lon,
      previousRenterUsername,
      lock,
    } = bike;

    const editButton = (
      <Button size="tiny" compact onClick={() => openEditor({ object: bike })}>
        Edit
      </Button>
    );

    const deleteButton = (
      <Button
        size="tiny"
        compact
        onClick={() => this.setState({ deleteBikeModal: id })}
      >
        Delete
      </Button>
    );

    const printButton = (
      <Button size="tiny" compact onClick={() => this.showQRCodeModal(bike)}>
        Print QR Code
      </Button>
    );

    const handleLocationClick = () => {
      window.scrollTo(0, 0);
      this.map.panTo({ lat, lng: lon });
    };

    return (
      <Table.Row key={id} className="admin-table-row">
        <Table.Cell>
          <span style={{ paddingRight: '10px' }}>{id}</span>
        </Table.Cell>
        <Table.Cell>{lock}</Table.Cell>
        <Table.Cell>
          <BoolIcon value={visible} />
        </Table.Cell>
        <Table.Cell>
          <a className="link-button" onClick={() => handleLocationClick()}>
            show on map
          </a>
        </Table.Cell>
        <Table.Cell>{currentRenterUsername || '-'}</Table.Cell>
        <Table.Cell>{previousRenterUsername || '-'}</Table.Cell>
        <Table.Cell>
          <div className="actions">
            {editButton}
            {deleteButton}
            {printButton}
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderBikes() {
    const { bikes } = this.props;
    if (!bikes) {
      return <Loader active inline="centered" />;
    }

    return (
      <Table className="admin-table hoverable" selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>LOCK ID</Table.HeaderCell>
            <Table.HeaderCell>VISIBLE</Table.HeaderCell>
            <Table.HeaderCell>LOCATION</Table.HeaderCell>
            <Table.HeaderCell>CURRENT RIDER</Table.HeaderCell>
            <Table.HeaderCell>LAST RIDER</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{bikes.map(b => this.renderBike(b)).toList()}</Table.Body>
      </Table>
    );
  }

  renderBikeMarker(bike) {
    return (
      <Marker
        key={bike.id}
        position={{ lat: bike.lat, lng: bike.lon }}
        label={`${bike.id}`}
      />
    );
  }

  renderCheckInArea(bikeRack) {
    const coords = bikeRack.checkInArea
      .get('coordinates')
      .first()
      .toJS();
    const formattedCoords = coords.map(coord => {
      return {
        lat: coord[1],
        lng: coord[0],
      };
    });

    return (
      <Polygon
        key={bikeRack.id}
        paths={formattedCoords}
        options={{
          fillColor: 'rgba(243,110,31,0.25)',
          strokeColor: 'rgba(243,110,31,0.5)',
        }}
      />
    );
  }

  renderMap() {
    const { bikes, bikeRacks } = this.props;
    const markers = bikes.map(bike => this.renderBikeMarker(bike)).toList();
    const checkInAreas = bikeRacks
      .map(rack => this.renderCheckInArea(rack))
      .toList();

    return (
      <GMap mapRef={ref => this.registerMapRef(ref)}>
        {markers}
        {checkInAreas}
      </GMap>
    );
  }

  render() {
    const { editorActive, openEditor, bikesError } = this.props;
    if (openEditor && editorActive) {
      return <BikeEditor />;
    }

    return (
      <div>
        {this.renderQRCodeModal()}
        {this.renderDeleteBikeModal()}
        {this.renderMap()}
        <Container style={{ paddingBottom: '10px' }}>
          <Button
            floated="right"
            onClick={() => openEditor({ object: new Bike() })}
            primary={true}
          >
            Add Bike
          </Button>
          <Header as="h2">Bikes</Header>
        </Container>
        {bikesError ? String(bikesError) : null}
        {this.renderBikes()}
      </div>
    );
  }
}

BikesView.propTypes = {
  bikeRacks: PropTypes.instanceOf(Map),
  bikes: PropTypes.instanceOf(Map),
  bikesError: PropTypes.object,
  rentals: PropTypes.instanceOf(List),
  rentalsError: PropTypes.object,
  editorActive: PropTypes.bool,
  /* dispatch */
  bikeRacksList: PropTypes.func,
  bikesList: PropTypes.func.isRequired,
  bikesRetrieve: PropTypes.func.isRequired,
  bikesDestroy: PropTypes.func.isRequired,
  openEditor: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    bikeRacks: state.bikeRacks.get('data'),
    bikes: state.bikes.get('data'),
    bikesError: state.bikes.get('error'),
    rentals: state.bikes.get(['rentals', 'rentals']),
    rentalsError: state.bikes.getIn(['rentals', 'error']),
    editorActive: state.bikeEditor.get('active', false),
  };
};

const mapDispatchToProps = {
  bikeRacksList: bikeRacksListAction,
  bikesList: bikesListAction,
  bikesRetrieve: bikesRetrieveAction,
  bikesDestroy: bikesDestroyAction,
  openEditor: openBikeEditor,
};

export default connect(mapStateToProps, mapDispatchToProps)(BikesView);
