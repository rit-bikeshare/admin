import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withNav from '../../withNav';

class BikesView extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    return <div>Bikes yO!</div>;
  }
}

BikesView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  bikes: PropTypes.instanceOf(Immutable.Map)
};

const mapStateToProps = state => {
  return {
    bikes: state.bikes
  };
};

export default connect(mapStateToProps)(withNav(BikesView, 'BIKES'));
