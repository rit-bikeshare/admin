import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Loader, Header, Message } from 'semantic-ui-react';
import DeleteModal from 'app/components/DeleteModal';
import {
  name as objectName,
  record as BikeshareUser,
  usersDestroyAction,
} from '../redux/users';
import {
  closeUserEditor as closeUserEditorAction,
  saveUserEditor as saveUserEditorAction,
} from '../redux/userEditor';

class UserEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _deleteModal: false,
      _status: '',
      _error: null,
      ...props.user.toJS(),
    };
  }

  componentWillUnmount() {
    const { closeUserEditor } = this.props;
    closeUserEditor();
  }

  save() {
    const { saveUserEditor } = this.props;
    saveUserEditor({ object: new BikeshareUser(this.state) })
      .then(() => this.setState({ _status: 'SUCCEEDED', _error: null }))
      .catch(e => this.setState({ _status: 'FAILED', _error: e }))
      .finally(next => {
        setTimeout(() => this.setState({ _status: '', _error: null }), 2000);
        return next;
      });

    this.setState({ _status: 'PENDING' });
  }

  renderDeleteModal() {
    const { _deleteModal, id } = this.state;
    const { destroyUser, closeUserEditor } = this.props;

    return _deleteModal ? (
      <DeleteModal
        id={id}
        objectName={objectName}
        deleteFn={destroyUser}
        onDelete={closeUserEditor}
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

  renderButtons() {
    const { closeUserEditor } = this.props;
    const { _status } = this.state;
    if (_status === 'PENDING') {
      return <Loader active inline="centered" />;
    }

    const deleteButton = (
      <Button
        floated="right"
        negative
        onClick={() => this.setState({ deleteModal: true })}
      >
        Delete user
      </Button>
    );

    return (
      <div>
        <Button basic primary onClick={() => closeUserEditor()}>
          Back
        </Button>
        <Button primary type="submit" onClick={() => this.save()}>
          Submit
        </Button>
        {deleteButton}
        {this.renderMessage()}
      </div>
    );
  }

  render() {
    const { username, firstName, lastName, isStaff } = this.state;

    return (
      <div>
        {this.renderDeleteModal()}
        <Header as="h3">Edit User</Header>
        <Form>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Username:</label>
              <input value={username} disabled />
            </Form.Field>
            <Form.Field>
              <label>First Name:</label>
              <input value={firstName} disabled />
            </Form.Field>
            <Form.Field>
              <label>Last Name:</label>
              <input value={lastName} disabled />
            </Form.Field>
          </Form.Group>
          <Form.Checkbox
            checked={isStaff}
            label="Staff user"
            onChange={(_, { checked: isStaff }) => {
              this.setState({ isStaff });
            }}
          />
          {this.renderButtons()}
        </Form>
      </div>
    );
  }
}

UserEditor.propTypes = {
  user: PropTypes.object.isRequired,
  /* dispatch */
  destroyUser: PropTypes.func.isRequired,
  saveUserEditor: PropTypes.func.isRequired,
  closeUserEditor: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.userEditor.get('user'),
});

const mapDispatchToProps = {
  usersDestroy: usersDestroyAction,
  saveUserEditor: saveUserEditorAction,
  closeUserEditor: closeUserEditorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserEditor);
