import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Container, Table, Button, Loader, Header } from 'semantic-ui-react';
import withNav from '../../withNav';
//import { editorAction } from '../../redux/bikes/actions';
import { actions as bikeActions } from '../../redux/bikes';
import Editor from './Editor';
import { DeleteBikeModal } from './DeleteBikeModal';

class BikesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteBikeModal: null // id of bike deleting
    };
  }

  componentDidMount() {
    const { listBikes, retrieveBike } = this.props;
    listBikes();
    retrieveBike({ id: 10 });
    //fetchRentals();
  }

  onDeleteBike(id) {
    return ';';
  }

  renderDeleteBikeModal() {
    const { deleteBikeModal: id } = this.state;
    if (!id) {
      return null;
    }

    const { deleteBike } = this.props;

    return (
      <DeleteBikeModal
        id={id}
        onCancel={() => this.setState({ deleteBikeModal: null })}
        onDelete={() => deleteBike({ id })}
      />
    );
  }

  renderBike(bike) {
    const { openEditor } = this.props;
    const { id, currentRental, lat, lon } = bike.toJS();

    const editButton = (
      <Button size="tiny" compact onClick={() => openEditor(bike.toJS())}>
        Edit
      </Button>
    );

    const deleteButton = (
      <Button
        size="tiny"
        compact
        onClick={() => this.setState({ deleteBikeModal: id })}
      >
        Delete
      </Button>
    );

    const printButton = (
      <Button size="tiny" compact>
        Print QR Code
      </Button>
    );

    return (
      <Table.Row className="admin-table-row">
        <Table.Cell>
          <span style={{ paddingRight: '20px' }}>{id}</span>
        </Table.Cell>
        <Table.Cell>{`${lat}, ${lon}`}</Table.Cell>
        <Table.Cell>{currentRental ? 'out' : '?'}</Table.Cell>
        <Table.Cell>rider?</Table.Cell>
        <Table.Cell>
          <div className="actions">
            {editButton}
            {deleteButton}
            {printButton}
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderBikes() {
    const { bikes } = this.props;
    if (!bikes) {
      return <Loader active inline="centered" />;
    }

    return (
      <Table celled className="admin-table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>LOCATION</Table.HeaderCell>
            <Table.HeaderCell>CHECKED IN</Table.HeaderCell>
            <Table.HeaderCell>LAST RIDER</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{bikes.map(b => this.renderBike(b)).toList()}</Table.Body>
      </Table>
    );
  }

  render() {
    const { editorActive, openEditor, bikesError } = this.props;
    if (openEditor && editorActive) {
      return <Editor />;
    }

    return (
      <div>
        {this.renderDeleteBikeModal()}
        <Container style={{ paddingBottom: '10px' }}>
          <Button floated="right" onClick={() => openEditor()}>
            Add Bike
          </Button>
          <Header as="h2">Bikes</Header>
        </Container>
        {bikesError ? String(bikesError) : null}
        {this.renderBikes()}
      </div>
    );
  }
}

BikesView.propTypes = {
  bikes: PropTypes.instanceOf(Immutable.Map),
  bikesError: PropTypes.object,
  rentals: PropTypes.instanceOf(Immutable.List),
  rentalsError: PropTypes.object,
  editorActive: PropTypes.bool,
  /* dispatch */
  listBikes: PropTypes.func.isRequired,
  retrieveBike: PropTypes.func.isRequired,
  deleteBike: PropTypes.func.isRequired,
  openEditor: PropTypes.func
};

const mapStateToProps = state => {
  return {
    bikes: state.bikes.get('data'),
    bikesError: state.bikes.get('error'),
    rentals: state.bikes.get(['rentals', 'rentals']),
    rentalsError: state.bikes.getIn(['rentals', 'error']),
    editorActive: state.bikes.getIn(['editor', 'active'], false)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    listBikes: () => dispatch(bikeActions.list()),
    retrieveBike: ({ id }) => dispatch(bikeActions.retrieve({ id })),
    deleteBike: ({ id, obj }) => dispatch(bikeActions.destroy({ id, obj }))
    //openEditor: bike => dispatch(editorAction({ active: true, bike }))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withNav(BikesView, 'BIKES')
);
