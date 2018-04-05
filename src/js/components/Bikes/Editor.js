import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withNav from '../../withNav';
import { fetchBikes, fetchRentals } from '../../redux/bikes/actions';

import { Table, Button, Loader, Header } from 'semantic-ui-react';

class Editor extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    //dispatch(fetchBikes());
    //dispatch(fetchRentals());
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

Editor.propTypes = {
  bike: PropTypes.instanceOf(Immutable.Map),
  error: PropTypes.object
};

const mapStateToProps = state => {
  return {
    bike: state.bikes.getIn(['editor', 'bike']),
    error: state.bikes.getIn(['editor', 'error'])
  };
};

export default connect(mapStateToProps)(Editor);
