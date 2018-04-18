import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Container, Table, Button, Loader, Header } from 'semantic-ui-react';
import BoolIcon from 'lib/components/BoolIcon';
import { list as listUsersAction } from '../actions/userActions';
import openUserEditorAction from '../actions/openUserEditor';
import Editor from './UserEditor';
import User from '../records/User';

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = { deleteuserModal: null };
  }

  componentDidMount() {
    const { listUsers } = this.props;
    listUsers();
  }

  renderUser(user) {
    const { openUserEditor } = this.props;
    const { username, firstName, lastName, isStaff } = user;

    const editButton = (
      <Button
        size="tiny"
        compact
        onClick={() => openUserEditor({ object: user })}
      >
        Edit
      </Button>
    );

    return (
      <Table.Row key={user.id} className="admin-table-row">
        <Table.Cell>{username}</Table.Cell>
        <Table.Cell>{firstName}</Table.Cell>
        <Table.Cell>{lastName}</Table.Cell>
        <Table.Cell>
          <BoolIcon value={isStaff} />
        </Table.Cell>
        <Table.Cell>
          <div className="actions">{editButton}</div>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderUsers() {
    const { users } = this.props;
    if (!users) {
      return <Loader active inline="centered" />;
    }

    return (
      <Table className="admin-table hoverable" selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>USERNAME</Table.HeaderCell>
            <Table.HeaderCell>FIRST NAME</Table.HeaderCell>
            <Table.HeaderCell>LAST NAME</Table.HeaderCell>
            <Table.HeaderCell>ADMIN ACCESS</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{users.map(b => this.renderUser(b)).toList()}</Table.Body>
      </Table>
    );
  }

  render() {
    const { editorActive, openUserEditor, usersError } = this.props;
    if (openUserEditor && editorActive) {
      return <Editor />;
    }

    return (
      <div>
        <Container style={{ paddingBottom: '10px' }}>
          <Button
            floated="right"
            onClick={() => openUserEditor({ object: new User() })}
            primary={true}
          >
            Add user
          </Button>
          <Header as="h2">Users</Header>
        </Container>
        {usersError ? String(usersError) : null}
        {this.renderUsers()}
      </div>
    );
  }
}

UsersView.propTypes = {
  users: PropTypes.instanceOf(Map),
  usersError: PropTypes.object,
  editorActive: PropTypes.bool,
  /* dispatch */
  listUsers: PropTypes.func.isRequired,
  openUserEditor: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    users: state.users.get('data'),
    usersError: state.users.get('error'),
    editorActive: state.userEditor.get('active', false),
  };
};

const mapDispatchToProps = {
  listUsers: listUsersAction,
  openuserEditor: openUserEditorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
