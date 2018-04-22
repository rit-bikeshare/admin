import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import ChartContainer from '../../app/components/ChartContainer';
import DataWell from '../../lib/components/DataWell';

class HomeView extends Component {
  renderStat(stat) {
    return <DataWell title={stat.title} value={stat.value} />;
  }

  render() {
    const { statData } = this.props;
    const children = statData.map(stat => this.renderStat(stat));

    return (
      <div>
        <h2>Usage Statistics</h2>
        <ChartContainer />
        <Segment className="stat-container">{children}</Segment>
      </div>
    );
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
