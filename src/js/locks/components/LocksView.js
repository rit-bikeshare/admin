import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Table, Button, Loader } from 'semantic-ui-react';
import BoolIcon from 'lib/components/BoolIcon';
//import UserEditor from './UserEditor';
import { locksListAction } from '../redux/locks';

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteUserModal: null,
      userSearchMode: 'username',
      userSearchString: '',
    };
  }

  componentDidMount() {
    const { locksList } = this.props;
    locksList();
  }

  componentWillUpdate(nextProps) {
    const { locksList, editorActive } = this.props;
    if (editorActive && !nextProps.editorActive) {
      locksList();
    }
  }

  renderLock(lock) {
    //const { openUserEditor } = this.props;
    //const { username, firstName, lastName, isStaff } = user;

    const editButton = (
      <Button
        size="tiny"
        compact
        //onClick={() => openUserEditor({ object: user })}
      >
        Edit
      </Button>
    );

    return (
      <Table.Row key={lock.id} className="admin-table-row">
        <Table.Cell>asdf</Table.Cell>
        <Table.Cell>asdf</Table.Cell>
        <Table.Cell>asdf</Table.Cell>
        <Table.Cell>
          <BoolIcon value={false} />
        </Table.Cell>
        <Table.Cell>
          <div className="actions">{editButton}</div>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderLocks() {
    const { locks } = this.props;
    if (!locks) {
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
        <Table.Body>{locks.map(b => this.renderLock(b)).toList()}</Table.Body>
      </Table>
    );
  }

  render() {
    const { editorActive, /* openUserEditor, */ locksError } = this.props;
    if (editorActive) {
      //return <UserEditor />;
    }

    return (
      <div>
        {locksError ? String(locksError) : null}
        {this.renderLocks()}
      </div>
    );
  }
}

UsersView.propTypes = {
  locks: PropTypes.instanceOf(Map),
  locksError: PropTypes.object,
  editorActive: PropTypes.bool,
  /* dispatch */
  locksList: PropTypes.func.isRequired,
  //openUserEditor: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    locks: state.locks.get('data'),
    locksError: state.locks.get('error'),
    //editorActive: state.userEditor.get('active', false),
  };
};

const mapDispatchToProps = {
  locksList: locksListAction,
  //openUserEditor: openUserEditorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
