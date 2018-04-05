import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withNav from '../../withNav';
import { fetchBikes, fetchRentals } from '../../redux/bikes/actions';

import { Table, Button, Loader, Header } from 'semantic-ui-react';

class BikesView extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchBikes());
    dispatch(fetchRentals());
  }

  renderBike(bike) {
    const { id, currentRental, lat, lon } = bike.toJS();
    return (
      <Table.Row>
        <Table.Cell>
          <span style={{ paddingRight: '20px' }}>{id}</span>
          <Button size="tiny" compact>
            Edit
          </Button>
          <Button size="tiny" compact>
            Delete
          </Button>
          <Button size="tiny" compact>
            Print QR Code
          </Button>
        </Table.Cell>
        <Table.Cell>{`${lat}, ${lon}`}</Table.Cell>
        <Table.Cell>{currentRental ? 'out' : '?'}</Table.Cell>
        <Table.Cell>rider?</Table.Cell>
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
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>BIKE ID</Table.HeaderCell>
            <Table.HeaderCell>LOCATION</Table.HeaderCell>
            <Table.HeaderCell>CHECKED IN</Table.HeaderCell>
            <Table.HeaderCell>LAST RIDER</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{bikes.map(this.renderBike)}</Table.Body>
      </Table>
    );
  }

  render() {
    return (
      <div>
        <Header as="h3">Bikes</Header>
        {this.renderBikes()}
      </div>
    );
  }
}

BikesView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  bikes: PropTypes.instanceOf(Immutable.List),
  bikesError: PropTypes.object,
  rentals: PropTypes.instanceOf(Immutable.List),
  rentalsError: PropTypes.object
};

const mapStateToProps = state => {
  return {
    bikes: state.bikes.getIn(['bikes', 'bikes']),
    bikesError: state.bikes.getIn(['bikes', 'error']),
    rentals: state.bikes.get(['rentals', 'rentals']),
    rentalsError: state.bikes.getIn(['rentals', 'error'])
  };
};

export default connect(mapStateToProps)(withNav(BikesView, 'BIKES'));
