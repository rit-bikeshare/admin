import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Marker } from 'react-google-maps';
import {
  Container,
  Table,
  Button,
  Loader,
  Header,
  Modal,
} from 'semantic-ui-react';
import MarkerMap from 'app/components/Map';
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

  componentDidMount() {
    const { bikesList } = this.props;
    bikesList();
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
      currentRenterUsername,
      lat,
      lon,
      previousRenterUsername,
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
      this.map.panTo({ lat, lng: lon });
      window.scrollTo(0, 0);
    };

    return (
      <Table.Row className="admin-table-row">
        <Table.Cell>
          <span style={{ paddingRight: '20px' }}>{id}</span>
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

  renderMap() {
    const { bikes } = this.props;
    const markers = bikes.map(bike => this.renderBikeMarker(bike)).toList();

    return (
      <MarkerMap mapRef={ref => this.registerMapRef(ref)}>{markers}</MarkerMap>
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
  bikes: PropTypes.instanceOf(Immutable.Map),
  bikesError: PropTypes.object,
  rentals: PropTypes.instanceOf(Immutable.List),
  rentalsError: PropTypes.object,
  editorActive: PropTypes.bool,
  /* dispatch */
  bikesList: PropTypes.func.isRequired,
  bikesRetrieve: PropTypes.func.isRequired,
  bikesDestroy: PropTypes.func.isRequired,
  openEditor: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    bikes: state.bikes.get('data'),
    bikesError: state.bikes.get('error'),
    rentals: state.bikes.get(['rentals', 'rentals']),
    rentalsError: state.bikes.getIn(['rentals', 'error']),
    editorActive: state.bikeEditor.get('active', false),
  };
};

const mapDispatchToProps = {
  bikesList: bikesListAction,
  bikesRetrieve: bikesRetrieveAction,
  bikesDestroy: bikesDestroyAction,
  openEditor: openBikeEditor,
};

export default connect(mapStateToProps, mapDispatchToProps)(BikesView);
