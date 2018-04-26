import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Header, Container, Table, Button, Loader } from 'semantic-ui-react';
import DeleteModal from 'app/components/DeleteModal';
//import UserEditor from './UserEditor';
import { bikesListAction } from 'bikes/redux/bikes';
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
    const { locksList, bikesList } = this.props;
    locksList();
    bikesList();
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
    const { bikesByLock } = this.props;
    const { id } = lock;

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
          {bikesByLock.has(id) ? bikesByLock.get(id).id : '-'}
        </Table.Cell>
        <Table.Cell>
          <div className="actions">{deleteButton}</div>
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
            <Table.HeaderCell>ASSIGNED TO BIKE</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{locks.map(l => this.renderLock(l)).toList()}</Table.Body>
      </Table>
    );
  }

  render() {
    const { locksError } = this.props;

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
  bikesByLock: PropTypes.instanceOf(Map),
  /* dispatch */
  locksList: PropTypes.func.isRequired,
  locksDestroy: PropTypes.func.isRequired,
  bikesList: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const bikesByLock = state.bikes
    .get('data')
    .filter(b => b.lock)
    .mapKeys((_, b) => b.lock);

  return {
    locks: state.locks.get('data'),
    locksError: state.locks.get('error'),
    bikesByLock,
  };
};

const mapDispatchToProps = {
  locksList: locksListAction,
  locksDestroy: locksDestroyAction,
  bikesList: bikesListAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
