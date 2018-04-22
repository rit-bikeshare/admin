import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Loader, Header, Message } from 'semantic-ui-react';
import { name as objectName, record as Bike } from '../BikesRedux';
import { destroy as destroyBikeAction } from '../actions/bikesActions';
import {
  closeBikeEditor as closeBikeEditorAction,
  saveBikeEditor as saveBikeEditorAction,
} from '../actions/bikeEditorActions';
import DeleteModal from 'app/components/DeleteModal';

class Editor extends Component {
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
    const { saveBikeEditor } = this.props;
    saveBikeEditor(new Bike(this.state))
      .then(() => this.setState({ _status: 'SUCCEEDED', _error: null }))
      .catch(e => this.setState({ _status: 'FAILED', _error: e }));

    this.setState({ _status: 'PENDING' });
  }

  renderDeleteModal() {
    const { _deleteModal, id } = this.state;
    const { deleteBike, closeBikeEditor } = this.props;

    return _deleteModal ? (
      <DeleteModal
        id={id}
        objectName={objectName}
        deleteFn={deleteBike}
        onDelete={closeBikeEditor}
        onCancel={() => this.setState({ deleteModal: false })}
      />
    ) : null;
  }

  renderMessage() {
    const { _status, _error = '' } = this.state;
    if (_status === 'FAILED') {
      return (
        <Message visible error header="Something went wrong" content={_error} />
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
          <Form.Field>
            <label>Lock id:</label>
            <input
              placeholder="Unique lock identifier"
              initialValue={lock}
              onChange={({ target: { value: lock } }) =>
                this.setState({ lock })
              }
            />
            {lock}
          </Form.Field>
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

Editor.propTypes = {
  bike: PropTypes.string,
  /* dispatch */
  deleteBike: PropTypes.func.isRequired,
  saveBikeEditor: PropTypes.func.isRequired,
  closeBikeEditor: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  bike: state.bikeEditor.get('bike'),
});

const mapDispatchToProps = dispatch => ({
  deleteBike: ({ id, obj }) => dispatch(destroyBikeAction({ id, obj })),
  saveBikeEditor: bike => dispatch(saveBikeEditorAction({ object: bike })),
  closeBikeEditor: () => dispatch(closeBikeEditorAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
