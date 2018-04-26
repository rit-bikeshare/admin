import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Header, Container, Table, Button, Loader } from 'semantic-ui-react';
import DeleteModal from 'app/components/DeleteModal';
//import UserEditor from './UserEditor';
import {
  name as objectName,
  locksListAction,
  locksDestroyAction,
} from '../redux/locks';

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = { deleteLockModal: null };
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

  renderDeleteLockModal() {
    const { deleteLockModal: id } = this.state;
    return id ? (
      <DeleteModal
        id={id}
        objectName={objectName}
        deleteFn={this.props.locksDestroy}
        onDelete={() => this.setState({ deleteLockModal: null })}
        onCancel={() => this.setState({ deleteLockModal: null })}
      />
    ) : null;
  }

  renderLock(lock) {
    //const { openUserEditor } = this.props;
    const { id } = lock;

    const editButton = (
      <Button
        size="tiny"
        compact
        //onClick={() => openUserEditor({ object: user })}
      >
        Edit
      </Button>
    );

    const deleteButton = (
      <Button
        size="tiny"
        compact
        onClick={() => this.setState({ deleteLockModal: id })}
      >
        Delete
      </Button>
    );

    return (
      <Table.Row key={id} className="admin-table-row">
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>
          <div className="actions">
            {editButton}
            {deleteButton}
          </div>
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
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{locks.map(l => this.renderLock(l)).toList()}</Table.Body>
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
        {this.renderDeleteLockModal()}
        {locksError ? String(locksError) : null}
        <Container style={{ paddingBottom: '10px' }}>
          <Header as="h2">Locks</Header>
        </Container>
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
  locksDestroy: PropTypes.func.isRequired,
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
  locksDestroy: locksDestroyAction,
  //openUserEditor: openUserEditorAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
