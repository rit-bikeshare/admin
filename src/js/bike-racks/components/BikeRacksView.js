import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, Map } from 'immutable';
import { Polygon } from 'react-google-maps';
import { Container, Table, Button, Loader, Header } from 'semantic-ui-react';
import GMap from 'app/components/GMap';
import DeleteModal from 'app/components/DeleteModal';
import BikeRackMarker from './BikeRackMarker';
import BikeRackEditor from './BikeRackEditor';
import {
  name as objectName,
  bikeRacksListAction,
  bikeRacksDestroyAction,
} from '../redux/bikeRacks';
import { openBikeRackEditor } from '../redux/bikeRackEditor';
import BikeRack from '../records/BikeRack';

class BikeRacksView extends Component {
  constructor(props) {
    super(props);
    this.state = { deleteBikeRackModal: null };
    this.registerMapRef = this.registerMapRef.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.pollTimeout);
  }

  componentWillMount() {
    const { bikeRacksList } = this.props;
    bikeRacksList();
    this.pollTimeout = setInterval(() => bikeRacksList(), 5000);
  }

  registerMapRef(ref) {
    this.map = ref;
  }

  renderDeleteBikeRackModal() {
    const { deleteBikeRackModal: id } = this.state;
    return id ? (
      <DeleteModal
        id={id}
        objectName={objectName}
        deleteFn={this.props.bikeRacksDestroy}
        onDelete={() => this.setState({ deleteBikeRackModal: null })}
        onCancel={() => this.setState({ deleteBikeRackModal: null })}
      />
    ) : null;
  }

  renderBikeRackMarker(rack) {
    return <BikeRackMarker key={`${rack.id}-marker`} bikeRack={rack} />;
  }

  renderBikeRackCheckOutArea(bikeRack) {
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
    const { bikeRacks } = this.props;
    const markers = bikeRacks.reduce((acc, rack) => {
      return acc
        .push(this.renderBikeRackMarker(rack))
        .push(this.renderBikeRackCheckOutArea(rack));
    }, List());

    return <GMap mapRef={ref => this.registerMapRef(ref)}>{markers}</GMap>;
  }

  renderBikeRack(bikeRack) {
    const { openEditor } = this.props;
    const { id, name, bikeCount, lat, lon } = bikeRack.toJS();

    const editButton = (
      <Button
        size="tiny"
        compact
        onClick={() => openEditor({ object: bikeRack })}
      >
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

    const handleLocationClick = () => {
      window.scrollTo(0, 0);
      this.map.panTo({ lat, lng: lon });
    };

    return (
      <Table.Row key={id} className="admin-table-row">
        <Table.Cell>
          <span style={{ paddingRight: '20px' }}>{name}</span>
        </Table.Cell>
        <Table.Cell>
          <a className="link-button" onClick={handleLocationClick}>
            show on map
          </a>
        </Table.Cell>
        <Table.Cell>{bikeCount}</Table.Cell>
        <Table.Cell>
          <div className="actions">
            {editButton}
            {deleteButton}
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
            <Table.HeaderCell>LOCATION</Table.HeaderCell>
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
      return <BikeRackEditor />;
    }

    return (
      <div>
        {this.renderDeleteBikeRackModal()}
        {this.renderMap()}
        <Container style={{ paddingBottom: '10px' }}>
          <Button
            primary
            floated="right"
            onClick={() =>
              openEditor({ object: new BikeRack(), creating: true })
            }
          >
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
  bikeRacks: PropTypes.instanceOf(Map),
  bikeRacksError: PropTypes.object,
  editorActive: PropTypes.bool,
  /* dispatch */
  bikeRacksList: PropTypes.func.isRequired,
  bikeRacksDestroy: PropTypes.func.isRequired,
  openEditor: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    bikeRacks: state.bikeRacks.get('data'),
    bikeRacksError: state.bikeRacks.get('error'),
    editorActive: state.bikeRackEditor.get('active', false),
  };
};

const mapDispatchToProps = {
  bikeRacksList: bikeRacksListAction,
  bikeRacksDestroy: bikeRacksDestroyAction,
  openEditor: openBikeRackEditor,
};

export default connect(mapStateToProps, mapDispatchToProps)(BikeRacksView);
