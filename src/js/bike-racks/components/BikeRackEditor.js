import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { Polygon } from 'react-google-maps';
import {
  Button,
  Form,
  Loader,
  Header,
  Message,
  Input,
} from 'semantic-ui-react';

import DeleteModal from 'app/components/DeleteModal';
import MapSelect from './MapSelect';
import {
  indexFn,
  name as objectName,
  record as BikeRack,
  bikeRacksDestroyAction,
} from '../redux/bikeRacks';
import {
  openBikeRackEditor as openBikeRackEditorAction,
  closeBikeRackEditor as closeBikeRackEditorAction,
  saveBikeRackEditor as saveBikeRackEditorAction,
} from '../redux/bikeRackEditor';

class BikeRackEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _deleteModal: false,
      _status: '',
      _error: null,
      bikeRack: props.bikeRack || new BikeRack(),
    };

    this.clearBikeRackMapEdits = this.clearBikeRackMapEdits.bind(this);
  }

  componentWillUnmount() {
    const { closeBikeRackEditor } = this.props;
    closeBikeRackEditor();
  }

  clearBikeRackMapEdits() {
    const { bikeRack: editedBikeRack } = this.state;
    const { bikeRack = new BikeRack() } = this.props;
    this.setState({
      bikeRack: editedBikeRack
        .set('checkInArea', bikeRack.checkInArea)
        .set('lat', bikeRack.lat)
        .set('lon', bikeRack.lon),
    });
  }

  save() {
    const { saveBikeRackEditor, openBikeRackEditor } = this.props;
    saveBikeRackEditor({ object: new BikeRack(this.state.bikeRack) })
      .then(bikeRack => {
        this.setState({ _status: 'SUCCEEDED', _error: null, bikeRack });
        openBikeRackEditor({ object: bikeRack, creating: false });
      })
      .catch(e => this.setState({ _status: 'FAILED', _error: e }))
      .finally(next => {
        setTimeout(() => this.setState({ _status: '', _error: null }), 5000);
        return next;
      });

    this.setState({ _status: 'PENDING' });
  }

  renderDeleteModal() {
    const { _deleteModal, bikeRack } = this.state;
    const { bikeRacksDestroy, closeBikeRackEditor } = this.props;

    return _deleteModal ? (
      <DeleteModal
        id={bikeRack.get('id')}
        objectName={objectName}
        deleteFn={bikeRacksDestroy}
        onDelete={closeBikeRackEditor}
        onCancel={() => this.setState({ _deleteModal: false })}
      />
    ) : null;
  }

  renderMessage() {
    const { _status, _error = '' } = this.state;
    if (_status === 'FAILED') {
      const error = fromJS(_error.error);
      const str = error
        .flatten()
        .toList()
        .toJS()
        .join(' ');

      console.log(str); // eslint-disable-line

      return (
        <Message
          visible
          error
          header="Something went wrong"
          content="Failed: Please ensure all fields are complete. Including an area polygon AND a marker location."
        />
      );
    }

    if (_status === 'SUCCEEDED') {
      return <Message visible success header="Success" />;
    }

    return null;
  }

  renderButtons() {
    const { closeBikeRackEditor, creating } = this.props;
    const { _status } = this.state;
    if (_status === 'PENDING') {
      return <Loader active inline="centered" />;
    }

    const deleteButton = !creating ? (
      <Button
        floated="right"
        negative
        onClick={() => this.setState({ _deleteModal: true })}
      >
        Delete bikeRack
      </Button>
    ) : null;

    return (
      <div>
        {this.renderMessage()}
        <Button basic primary onClick={() => closeBikeRackEditor()}>
          Back
        </Button>
        <Button primary type="submit" onClick={() => this.save()}>
          Submit
        </Button>
        {deleteButton}
      </div>
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

  render() {
    const { bikeRacks } = this.props;
    const { bikeRack } = this.state;
    const id = indexFn(bikeRack) || null;
    const checkInAreas = bikeRacks
      .filter(rack => rack.id !== bikeRack.id)
      .map(rack => this.renderCheckInArea(rack))
      .toList();

    return (
      <div>
        {this.renderDeleteModal()}
        <Header as="h3">{id ? 'Edit Bike Rack' : 'Create Bike Rack'}</Header>
        <Form>
          <Form.Field>
            <label>Bike rack id:</label>
            <Input
              placeholder="gosnell-east"
              value={id}
              onChange={(e, { value }) => {
                this.setState(({ bikeRack }) => ({
                  bikeRack: bikeRack.set('id', value),
                }));
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Bike rack name:</label>
            <Input
              placeholder="Gosnell East"
              value={bikeRack.name}
              onChange={(e, { value }) => {
                this.setState(({ bikeRack }) => ({
                  bikeRack: bikeRack.set('name', value),
                }));
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Bike rack description:</label>
            <Input
              placeholder="Bike rack on the east of gosnell near the library and carpool lane."
              value={bikeRack.description}
              onChange={(e, { value }) => {
                this.setState(({ bikeRack }) => ({
                  bikeRack: bikeRack.set('description', value),
                }));
              }}
            />
          </Form.Field>
          <Button
            size="tiny"
            className="m-bottom-2"
            onClick={this.clearBikeRackMapEdits}
          >
            Reset Map Edits
          </Button>
          <MapSelect
            bikeRack={bikeRack}
            onChange={bikeRack => this.setState({ bikeRack })}
          >
            {checkInAreas}
          </MapSelect>
          <Form.Field />
          {this.renderButtons()}
        </Form>
      </div>
    );
  }
}

BikeRackEditor.propTypes = {
  bikeRacks: PropTypes.instanceOf(Map),
  bikeRack: PropTypes.instanceOf(BikeRack),
  creating: PropTypes.bool,
  /* dispatch */
  bikeRacksDestroy: PropTypes.func.isRequired,
  saveBikeRackEditor: PropTypes.func.isRequired,
  closeBikeRackEditor: PropTypes.func.isRequired,
  openBikeRackEditor: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  bikeRacks: state.bikeRacks.get('data'),
  bikeRack: state.bikeRackEditor.get('bikeRack'),
  creating: state.bikeRackEditor.get('creating'),
});

const mapDispatchToProps = {
  bikeRacksDestroy: bikeRacksDestroyAction,
  openBikeRackEditor: openBikeRackEditorAction,
  saveBikeRackEditor: saveBikeRackEditorAction,
  closeBikeRackEditor: closeBikeRackEditorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(BikeRackEditor);
