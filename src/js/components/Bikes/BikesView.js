import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Container, Table, Button, Loader, Header } from 'semantic-ui-react';
import withNav from '../../withNav';
import {
  fetchBikes,
  fetchRentals,
  editorAction
} from '../../redux/bikes/actions';

import Editor from './Editor';

class BikesView extends Component {
  componentDidMount() {
    const { fetchBikes, fetchRentals } = this.props;
    fetchBikes();
    fetchRentals();
  }

  renderBike(bike) {
    const { id, currentRental, lat, lon } = bike.toJS();
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
            <Button size="tiny" compact>
              Edit
            </Button>
            <Button size="tiny" compact>
              Delete
            </Button>
            <Button size="tiny" compact>
              Print QR Code
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderBikes() {
    const { bikes, bikesError } = this.props;

    if (bikesError) {
      return String(bikesError);
    }

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
        <Table.Body>{bikes.map(this.renderBike)}</Table.Body>
      </Table>
    );
  }

  render() {
    const { editorActive, openEditor } = this.props;
    if (openEditor && editorActive) {
      return <Editor />;
    }

    return (
      <div>
        <Container style={{ paddingBottom: '10px' }}>
          <Button floated="right" onClick={() => openEditor()}>
            Add Bike
          </Button>
          <Header as="h2">Bikes</Header>
        </Container>
        {this.renderBikes()}
      </div>
    );
  }
}

BikesView.propTypes = {
  bikes: PropTypes.instanceOf(Immutable.List),
  bikesError: PropTypes.object,
  rentals: PropTypes.instanceOf(Immutable.List),
  rentalsError: PropTypes.object,
  editorActive: PropTypes.bool,

  fetchBikes: PropTypes.func.isRequired,
  fetchRentals: PropTypes.func.isRequired,
  openEditor: PropTypes.func
};

const mapStateToProps = state => {
  return {
    bikes: state.bikes.getIn(['bikes', 'bikes']),
    bikesError: state.bikes.getIn(['bikes', 'error']),
    rentals: state.bikes.get(['rentals', 'rentals']),
    rentalsError: state.bikes.getIn(['rentals', 'error']),
    editorActive: state.bikes.getIn(['editor', 'active'], false)
  };
};

const mapDispatchToProps = dispatch => ({
  fetchBikes: () => dispatch(fetchBikes()),
  fetchRentals: () => dispatch(fetchRentals()),
  openEditor: bike => dispatch(editorAction({ active: true, bike }))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withNav(BikesView, 'BIKES')
);
