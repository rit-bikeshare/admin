import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Marker } from 'react-google-maps';
import { Container, Table, Button, Loader, Header } from 'semantic-ui-react';
import {
  list as listBikeRackAction,
  destroy as destroyBikeRackAction,
} from '../actions/bikeRacksActions';
import { name as objectName } from '../bikeRacksRedux';
//import Editor from './Editor';
import MarkerMap from 'app/components/Map';
import DeleteModal from 'app/components/DeleteModal';

class BikeRacksView extends Component {
  constructor(props) {
    super(props);
    this.state = { deleteBikeRackModal: null };
  }

  componentDidMount() {
    const { listBikeRacks } = this.props;
    listBikeRacks();
  }

  renderDeleteBikeRackModal() {
    const { deleteBikeRackModal: id } = this.state;
    return id ? (
      <DeleteModal
        id={id}
        objectName={objectName}
        deleteFn={this.props.deleteBikeRack}
        onDelete={() => this.setState({ deleteBikeRackModal: null })}
        onCancel={() => this.setState({ deleteBikeRackModal: null })}
      />
    ) : null;
  }

  renderMap() {
    const { bikeRacks } = this.props;
    const markers = bikeRacks
      ? bikeRacks.map(rack => (
          <Marker key={rack.id} position={{ lat: rack.lat, lng: rack.lon }} />
        ))
      : Immutable.List();

    return <MarkerMap markers={markers} />;
  }

  renderBikeRack(bikeRack) {
    const { openEditor } = this.props;
    const { id, name, bikeCount } = bikeRack.toJS();

    const editButton = (
      <Button size="tiny" compact onClick={() => openEditor(bikeRack.toJS())}>
        Edit
      </Button>
    );

    const deleteButton = (
      <Button
        size="tiny"
        compact
        onClick={() => this.setState({ deleteBikeRackModal: id })}
      >
        Delete
      </Button>
    );

    const printButton = (
      <Button size="tiny" compact>
        Print check in QR Code
      </Button>
    );

    return (
      <Table.Row key={id} className="admin-table-row">
        <Table.Cell>
          <span style={{ paddingRight: '20px' }}>{name}</span>
        </Table.Cell>
        <Table.Cell>{bikeCount}</Table.Cell>
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

  renderBikeRacks() {
    const { bikeRacks } = this.props;
    if (!bikeRacks) {
      return <Loader active inline="centered" />;
    }

    return (
      <Table className="admin-table hoverable" selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>BIKE RACK</Table.HeaderCell>
            <Table.HeaderCell>NUMBER OF BIKES</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bikeRacks.map(rack => this.renderBikeRack(rack)).toList()}
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
          <Button primary floated="right" onClick={() => openEditor()}>
            Add Bike Rack
          </Button>
          <Header as="h2">Bike Racks</Header>
        </Container>
        {bikeRacksError ? String(bikeRacksError) : null}
        {this.renderBikeRacks()}
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
  openEditor: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    bikeRacks: state.bikeRacks.get('data'),
    bikeRacksError: state.bikeRacks.get('error'),
    editorActive: state.bikes.getIn(['editor', 'active'], false),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    listBikeRacks: () => dispatch(listBikeRackAction()),
    deleteBikeRack: ({ id, object }) =>
      dispatch(destroyBikeRackAction({ id, object })),
    //openEditor: bike => dispatch(editorAction({ active: true, bike }))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BikeRacksView);
