import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
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
  }

  componentWillUnmount() {
    const { closeBikeRackEditor } = this.props;
    closeBikeRackEditor();
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
        onCancel={() => this.setState({ deleteModal: false })}
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
      return (
        <Message visible error header="Something went wrong" content={str} />
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
        onClick={() => this.setState({ deleteModal: true })}
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

  render() {
    const { bikeRack } = this.state;
    const id = indexFn(bikeRack) || null;

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
          <MapSelect
            bikeRack={bikeRack}
            onChange={bikeRack => this.setState({ bikeRack })}
          />
          <Form.Field />
          {this.renderButtons()}
        </Form>
      </div>
    );
  }
}

BikeRackEditor.propTypes = {
  bikeRack: PropTypes.instanceOf(BikeRack),
  creating: PropTypes.bool,
  /* dispatch */
  bikeRacksDestroy: PropTypes.func.isRequired,
  saveBikeRackEditor: PropTypes.func.isRequired,
  closeBikeRackEditor: PropTypes.func.isRequired,
  openBikeRackEditor: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
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
