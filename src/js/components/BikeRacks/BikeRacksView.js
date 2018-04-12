import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Container, Table, Button, Loader, Header } from 'semantic-ui-react';
import withNav from '../../withNav';
import { actions as bikeRackActions } from '../../redux/bikeRacks';
//import Editor from './Editor';
import MarkerMap from '../Maps/Map';
import { Marker } from 'react-google-maps';
import { DeleteBikeRackModal } from './DeleteBikeRackModal';

class BikeRacksView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteBikeModal: null // id of bike deleting
    };
  }

  componentDidMount() {
    const { listBikeRacks } = this.props;
    listBikeRacks();
  }

  onDeleteBikeRack(id) {
    return ';';
  }

  renderDeleteBikeRackModal() {
    const { deleteBikeRackModal: id } = this.state;
    if (!id) {
      return null;
    }

    const { deleteBikeRack } = this.props;

    return (
      <DeleteBikeRackModal
        id={id}
        onCancel={() => this.setState({ deleteBikeRackModal: null })}
        onDelete={() => {
          deleteBikeRack({ id });
          this.setState({ deleteBikeRackModal: null });
        }}
      />
    );
  }

  renderMap() {
    const { bikeRacks } = this.props;
    const markers = bikeRacks
      ? bikeRacks.map(rack => (
          <Marker position={{ lat: rack.lat, lng: rack.lon }} />
        ))
      : Immutable.List();

    return <MarkerMap markers={markers} />;
  }

  renderBike(bike) {
    const { openEditor } = this.props;
    const { id, currentRental, lat, lon } = bike.toJS();

    const editButton = (
      <Button size="tiny" compact onClick={() => openEditor(bike.toJS())}>
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
      <Button size="tiny" compact>
        Print QR Code
      </Button>
    );

    return (
      <Table.Row className="admin-table-row">
        <Table.Cell>
          <span style={{ paddingRight: '20px' }}>{id}</span>
        </Table.Cell>
        <Table.Cell>{`${lat}, ${lon}`}</Table.Cell>
        <Table.Cell>{currentRental ? 'out' : '?'}</Table.Cell>
        <Table.Cell>rider?</Table.Cell>
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
    const { bikeRacks } = this.props;
    if (!bikeRacks) {
      return <Loader active inline="centered" />;
    }

    return (
      <Table celled className="admin-table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>LOCATION</Table.HeaderCell>
            <Table.HeaderCell>CHECKED IN</Table.HeaderCell>
            <Table.HeaderCell>LAST RIDER</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bikeRacks.map(b => this.renderBike(b)).toList()}
        </Table.Body>
      </Table>
    );
  }

  render() {
    const { editorActive, openEditor, bikeRacksError } = this.props;
    if (openEditor && editorActive) {
      //return <Editor />;
    }

    return (
      <div>
        {this.renderDeleteBikeRackModal()}
        {this.renderMap()}
        <Container style={{ paddingBottom: '10px' }}>
          <Button floated="right" onClick={() => openEditor()}>
            Add Bike
          </Button>
          <Header as="h2">Bike Racks</Header>
        </Container>
        {bikeRacksError ? String(bikeRacksError) : null}
        {this.renderBikes()}
      </div>
    );
  }
}

BikeRacksView.propTypes = {
  bikeRacks: PropTypes.instanceOf(Immutable.Map),
  bikeRacksError: PropTypes.object,
  editorActive: PropTypes.bool,
  /* dispatch */
  listBikeRacks: PropTypes.func.isRequired,
  deleteBikeRack: PropTypes.func.isRequired,
  openEditor: PropTypes.func
};

const mapStateToProps = state => {
  return {
    bikeRacks: state.bikeRacks.get('data'),
    bikeRacksError: state.bikeRacks.get('error'),
    editorActive: state.bikes.getIn(['editor', 'active'], false)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    listBikeRacks: () => dispatch(bikeRackActions.list()),
    deleteBikeRack: ({ id, object }) =>
      dispatch(bikeRackActions.destroy({ id, object }))
    //openEditor: bike => dispatch(editorAction({ active: true, bike }))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withNav(BikeRacksView, 'BIKE_RACKS')
);
