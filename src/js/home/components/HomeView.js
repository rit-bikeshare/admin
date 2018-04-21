import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DataWell from '../../lib/components/DataWell';

class HomeView extends Component {
  renderStat(stat) {
    return (
      <DataWell
        style={{ width: '25%' }}
        title={stat.title}
        value={stat.value}
      />
    );
  }

  render() {
    const { statData } = this.props;
    const children = statData.map(stat => this.renderStat(stat));
    return <div className="stat-container">{children}</div>;
  }
}

const mapStateToProps = () => ({
  statData: [
    {
      title: 'Active Rentals',
      value: 10,
    },
    {
      title: 'Total Rentals',
      value: 384,
    },
    {
      title: 'Total Riders',
      value: 214,
    },
    {
      title: 'Rentals this Week',
      value: 30,
    },
    {
      title: 'Another Stat',
      value: 30,
    },
  ],
});

HomeView.propTypes = {
  statData: PropTypes.array,
};

export default connect(mapStateToProps, {})(HomeView);
