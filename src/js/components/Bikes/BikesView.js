import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Container, Table, Button, Loader, Header } from 'semantic-ui-react';
import { actions as bikeActions, name as objectName } from '../../redux/bikes';
import { actions as bikeEditorActions } from '../../redux/bikeEditor';
//import { editorAction } from '../../redux/bikes/actions'
import withNav from '../../withNav';
import DeleteModal from '../DeleteModal';
import Editor from './Editor';
import { Bike } from '../../models';

class BikesView extends Component {
  constructor(props) {
    super(props);
    this.state = { deleteBikeModal: null };
  }

  componentDidMount() {
    const { listBikes } = this.props;
    listBikes();
  }

  renderDeleteBikeModal() {
    const { deleteBikeModal: id } = this.state;
    return id ? (
      <DeleteModal
        id={id}
        objectName={objectName}
        deleteFn={this.props.deleteBike}
        onDelete={() => this.setState({ deleteBikeModal: null })}
        onCancel={() => this.setState({ deleteBikeModal: null })}
      />
    ) : null;
  }

  renderBike(bike) {
    const { openEditor } = this.props;
    const { id, currentRental, lat, lon } = bike.toJS();

    const editButton = (
      <Button size="tiny" compact onClick={() => openEditor({ object: bike })}>
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
      <Table className="admin-table hoverable" selectable>
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
          <Button
            floated="right"
            onClick={() => openEditor({ object: new Bike() })}
            primary={true}
          >
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
  openEditor: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    bikes: state.bikes.get('data'),
    bikesError: state.bikes.get('error'),
    rentals: state.bikes.get(['rentals', 'rentals']),
    rentalsError: state.bikes.getIn(['rentals', 'error']),
    editorActive: state.bikeEditor.get('active', false),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    listBikes: () => dispatch(bikeActions.list()),
    retrieveBike: ({ id }) => dispatch(bikeActions.retrieve({ id })),
    deleteBike: ({ id, obj }) => dispatch(bikeActions.destroy({ id, obj })),
    openEditor: ({ id = null, object = null }) =>
      dispatch(bikeEditorActions.openBikeEditor({ id, object })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withNav(BikesView, 'BIKES')
);
