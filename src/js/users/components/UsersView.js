import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Set, Map } from 'immutable';
import {
  Container,
  Table,
  Button,
  Loader,
  Header,
  Input,
} from 'semantic-ui-react';
import BoolIcon from 'lib/components/BoolIcon';
import UserEditor from './UserEditor';
import { GROUPS, usersClearAction, usersSearchAction } from '../redux/users';
import { adminsListAction } from '../redux/admins';
import { openUserEditor as openUserEditorAction } from '../redux/userEditor';

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = { userSearchString: '' };
  }

  componentDidMount() {
    const { adminsList } = this.props;
    adminsList();
  }

  componentWillUpdate(nextProps) {
    const { adminsList, editorActive } = this.props;
    if (editorActive && !nextProps.editorActive) {
      adminsList();
    }
  }

  search() {
    const { usersSearch } = this.props;
    const { userSearchString } = this.state;
    usersSearch({ search: userSearchString });
  }

  renderUser(user) {
    const { openUserEditor } = this.props;
    const { username, firstName, lastName } = user;

    const isAdmin = user => Set(user.groups).has(GROUPS.ADMIN.id);
    const isMaintenance = user => Set(user.groups).has(GROUPS.MAINTENANCE.id);
    const isActive = user => user.isActive;

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
        <Table.Cell>
          {lastName}, {firstName}
        </Table.Cell>
        <Table.Cell>
          <BoolIcon value={isActive(user)} />
        </Table.Cell>
        <Table.Cell>
          <BoolIcon value={isAdmin(user)} />
        </Table.Cell>
        <Table.Cell>
          <BoolIcon value={isMaintenance(user)} />
        </Table.Cell>
        <Table.Cell>
          <div className="actions">{editButton}</div>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderUsers(users) {
    if (!users) {
      return <Loader active inline="centered" />;
    }

    return (
      <Table className="admin-table hoverable" selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>USERNAME</Table.HeaderCell>
            <Table.HeaderCell>NAME</Table.HeaderCell>
            <Table.HeaderCell>BIKESHARE ACCESS</Table.HeaderCell>
            <Table.HeaderCell>ADMIN ACCESS</Table.HeaderCell>
            <Table.HeaderCell>MAINTENENCE ACCESS</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{users.map(b => this.renderUser(b)).toList()}</Table.Body>
      </Table>
    );
  }

  renderUserSearch() {
    const { userSearchString } = this.state;
    return (
      <Input type="text" placeholder="Search..." action>
        <input
          value={userSearchString}
          onChange={({ target: { value: userSearchString } }) =>
            this.setState({ userSearchString })
          }
        />
        <Button type="submit" onClick={() => this.search()}>
          Search
        </Button>
      </Input>
    );
  }

  renderSearchedUsers() {
    const { users, usersClear } = this.props;

    const usersTable =
      users.count() > 0 ? (
        <div>
          {this.renderUsers(users)}
          <Button
            onClick={() => {
              usersClear();
              this.setState({ userSearchString: '' });
            }}
          >
            Clear
          </Button>
        </div>
      ) : (
        <span>No search results.</span>
      );

    return (
      <div>
        <Container
          style={{ paddingTop: '40px', paddingBottom: '15px', display: 'flex' }}
        >
          <Header as="h2" style={{ flexGrow: '1' }}>
            Users
          </Header>
          {this.renderUserSearch()}
        </Container>
        {usersTable}
      </div>
    );
  }

  renderAdmins() {
    const { admins } = this.props;
    return (
      <div>
        <Container style={{ paddingBottom: '10px' }}>
          <Header as="h2">Staff</Header>
        </Container>
        {this.renderUsers(admins)}
      </div>
    );
  }

  render() {
    const { editorActive, openUserEditor, usersError } = this.props;
    if (openUserEditor && editorActive) {
      return <UserEditor />;
    }

    return (
      <div>
        {usersError ? String(usersError) : null}
        {this.renderAdmins()}
        {this.renderSearchedUsers()}
      </div>
    );
  }
}

UsersView.propTypes = {
  admins: PropTypes.instanceOf(Map),
  adminsError: PropTypes.object,
  users: PropTypes.instanceOf(Map),
  usersError: PropTypes.object,
  editorActive: PropTypes.bool,
  /* dispatch */
  adminsList: PropTypes.func.isRequired,
  usersSearch: PropTypes.func.isRequired,
  usersClear: PropTypes.func.isRequired,
  openUserEditor: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    admins: state.admins.get('data'),
    adminsError: state.admins.get('error'),
    users: state.users.get('data'),
    usersError: state.users.get('error'),
    editorActive: state.userEditor.get('active', false),
  };
};

const mapDispatchToProps = {
  adminsList: adminsListAction,
  usersSearch: usersSearchAction,
  usersClear: usersClearAction,
  openUserEditor: openUserEditorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
