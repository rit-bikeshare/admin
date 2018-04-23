import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { Button, Form, Loader, Header, Message } from 'semantic-ui-react';
import DeleteModal from 'app/components/DeleteModal';
import BikeLockSelect from './BikeLockSelect';
import {
  name as objectName,
  record as Bike,
  bikesDestroyAction,
} from '../redux/bikes';
import {
  openBikeEditor as openBikeEditorAction,
  closeBikeEditor as closeBikeEditorAction,
  saveBikeEditor as saveBikeEditorAction,
} from '../redux/bikeEditor';

class BikeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _deleteModal: false,
      _status: '',
      _error: null,
      ...props.bike.toJS(),
    };
  }

  componentWillUnmount() {
    const { closeBikeEditor } = this.props;
    closeBikeEditor();
  }

  save() {
    const { saveBikeEditor, openBikeEditor } = this.props;
    saveBikeEditor({ object: new Bike(this.state) })
      .then(bike => {
        this.setState({ _status: 'SUCCEEDED', _error: null, ...bike.toJS() });
        openBikeEditor({ object: bike });
      })
      .catch(e => this.setState({ _status: 'FAILED', _error: e }))
      .finally(next => {
        setTimeout(() => this.setState({ _status: '', _error: null }), 10000);
        return next;
      });

    this.setState({ _status: 'PENDING' });
  }

  renderDeleteModal() {
    const { _deleteModal, id } = this.state;
    const { bikesDestroy, closeBikeEditor } = this.props;

    return _deleteModal ? (
      <DeleteModal
        id={id}
        objectName={objectName}
        deleteFn={bikesDestroy}
        onDelete={closeBikeEditor}
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

  renderButtons(showDelete = false) {
    const { closeBikeEditor } = this.props;
    const { _status } = this.state;
    if (_status === 'PENDING') {
      return <Loader active inline="centered" />;
    }

    const deleteButton = showDelete ? (
      <Button
        floated="right"
        negative
        onClick={() => this.setState({ deleteModal: true })}
      >
        Delete bike
      </Button>
    ) : null;

    return (
      <div>
        {this.renderMessage()}
        <Button basic primary onClick={() => closeBikeEditor()}>
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
    const { id, lock, visible } = this.state;
    const showDelete = Boolean(id);

    return (
      <div>
        {this.renderDeleteModal()}
        <Header as="h3">{id ? 'Edit Bike' : 'Create Bike'}</Header>
        <Form>
          {id ? (
            <Form.Field>
              <label>Bike id:</label>
              <input value={id} disabled />
            </Form.Field>
          ) : null}
          <BikeLockSelect
            lock={lock}
            onChange={lock => this.setState({ lock })}
          />
          <Form.Checkbox
            checked={visible}
            label="This bike is visible for checkout."
            onChange={(_, { checked: visible }) => {
              this.setState({ visible });
            }}
          />
          {this.renderButtons(showDelete)}
        </Form>
      </div>
    );
  }
}

BikeEditor.propTypes = {
  bike: PropTypes.string,
  /* dispatch */
  bikesDestroy: PropTypes.func.isRequired,
  saveBikeEditor: PropTypes.func.isRequired,
  closeBikeEditor: PropTypes.func.isRequired,
  openBikeEditor: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  bike: state.bikeEditor.get('bike'),
});

const mapDispatchToProps = {
  bikesDestroy: bikesDestroyAction,
  openBikeEditor: openBikeEditorAction,
  saveBikeEditor: saveBikeEditorAction,
  closeBikeEditor: closeBikeEditorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(BikeEditor);
