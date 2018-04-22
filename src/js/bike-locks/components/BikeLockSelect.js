import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map, Set } from 'immutable';
import { Select } from 'semantic-ui-react';
import { list as listBikeLocksAction } from '../actions/bikeLocksActions';

class BikeLockSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedId: null };
  }

  componentDidMount() {
    const { listBikeLocks } = this.props;
    listBikeLocks();
  }

  render() {
    const { bikeLocksStatus, availableLocks, lock, onChange } = this.props;

    if (bikeLocksStatus === 'PENDING') {
      return <Select placeholder="Select bike lock" search loading />;
    }

    const options = availableLocks
      .map(lock => ({
        key: lock.get('id'),
        text: lock.get('id'),
        value: lock.get('id'),
      }))
      .toList()
      .toJS();

    return (
      <Select
        placeholder="Select bike lock"
        search
        options={options}
        value={lock}
        onChange={(e, { value }) => onChange(value)}
      />
    );
  }
}

BikeLockSelect.propTypes = {
  availableLocks: PropTypes.instanceOf(Map),
  bikeLocksStatus: PropTypes.string,
  bikeLocksError: PropTypes.object,
  lock: PropTypes.string,
  onChange: PropTypes.func,
  /* dispatch */
  listBikeLocks: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const bikeLocks = state.bikeLocks.get('data');
  const editorBike = state.bikeEditor.get('bike');
  const editorBikeLock = bikeLocks.get(editorBike.lock);
  const bikes = state.bikes.get('data').set(editorBike.id, editorBike);

  const availableLocks = (() => {
    if (bikeLocks.count() > 0) {
      const usedIds = Set(bikes.map(({ lock }) => lock).toList());
      const filtered = bikeLocks.filter(({ id }) => !usedIds.contains(id));
      return editorBikeLock
        ? filtered.set(editorBikeLock.id, editorBikeLock)
        : filtered;
    }

    return bikeLocks;
  })();

  return {
    availableLocks,
    bikeLocksStatus: state.bikeLocks.get('status'),
    bikeLocksError: state.bikeLocks.get('error'),
  };
};

const mapDispatchToProps = {
  listBikeLocks: listBikeLocksAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(BikeLockSelect);
