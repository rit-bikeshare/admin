import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Set } from 'immutable';
import { Button, Form, Loader, Header, Message } from 'semantic-ui-react';
import DeleteModal from 'app/components/DeleteModal';
import {
  GROUPS,
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
      deleteModal: false,
      status: '',
      error: null,
      user: props.user,
    };
  }

  componentWillUnmount() {
    const { closeUserEditor } = this.props;
    closeUserEditor();
  }

  save() {
    const { saveUserEditor } = this.props;
    saveUserEditor({ object: new BikeshareUser(this.state.user) })
      .then(() => this.setState({ status: 'SUCCEEDED', error: null }))
      .catch(e => this.setState({ status: 'FAILED', error: e }))
      .finally(next => {
        setTimeout(() => this.setState({ status: '', error: null }), 2000);
        return next;
      });

    this.setState({ status: 'PENDING' });
  }

  renderDeleteModal() {
    const { deleteModal, user } = this.state;
    const { usersDestroy, closeUserEditor } = this.props;

    return deleteModal ? (
      <DeleteModal
        id={user.id}
        objectName={objectName}
        deleteFn={usersDestroy}
        onDelete={closeUserEditor}
        onCancel={() => this.setState({ deleteModal: false })}
      />
    ) : null;
  }

  renderMessage() {
    const { status, error = '' } = this.state;
    if (status === 'FAILED') {
      return (
        <Message visible error header="Something went wrong" content={error} />
      );
    }

    if (status === 'SUCCEEDED') {
      return <Message visible success header="Success" />;
    }

    return null;
  }

  renderButtons() {
    const { closeUserEditor } = this.props;
    const { status } = this.state;
    if (status === 'PENDING') {
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
    const { user } = this.state;

    const isAdmin = user => Set(user.groups).has(GROUPS.ADMIN.id);
    const isMaintenance = user => Set(user.groups).has(GROUPS.MAINTENANCE.id);
    const isStaff = user => isAdmin(user) || isMaintenance(user);
    const isActive = user => user.isActive;

    return (
      <div>
        {this.renderDeleteModal()}
        <Header as="h3">Edit User</Header>
        <Form>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Username:</label>
              <input value={user.username} disabled />
            </Form.Field>
            <Form.Field>
              <label>First Name:</label>
              <input value={user.firstName} disabled />
            </Form.Field>
            <Form.Field>
              <label>Last Name:</label>
              <input value={user.lastName} disabled />
            </Form.Field>
          </Form.Group>
          <Form.Checkbox
            checked={isActive(user)}
            label="BikeShare Access"
            onChange={(_, { checked }) => {
              this.setState(({ user }) => ({
                user: user.set('isActive', checked),
              }));
            }}
          />
          <Form.Checkbox
            checked={isAdmin(user)}
            label="Admin user"
            onChange={(_, { checked }) => {
              this.setState(({ user }) => ({
                user: user
                  .update(
                    'groups',
                    groups =>
                      checked
                        ? groups.push(GROUPS.ADMIN.id)
                        : groups.filter(id => id != GROUPS.ADMIN.id)
                  )
                  .update(user => user.set('isStaff', isStaff(user))),
              }));
            }}
          />
          <Form.Checkbox
            checked={isMaintenance(user)}
            label="Maintenance user"
            onChange={(_, { checked }) => {
              this.setState(({ user }) => ({
                user: user
                  .update(
                    'groups',
                    groups =>
                      checked
                        ? groups.push(GROUPS.MAINTENANCE.id)
                        : groups.filter(id => id != GROUPS.MAINTENANCE.id)
                  )
                  .update(user => user.set('isStaff', isStaff(user))),
              }));
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
  usersDestroy: PropTypes.func.isRequired,
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
