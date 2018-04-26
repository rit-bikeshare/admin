import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Loader } from 'semantic-ui-react';
import GphApiClient from 'giphy-js-sdk-core';
import fetchStatsAction from '../actions/fetchStats';
import DataWell from 'lib/components/DataWell';

class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gif: null,
    };
  }
  componentWillMount() {
    const { fetchStats } = this.props;
    fetchStats();
    this.pollInterval = setInterval(() => fetchStats(), 5000);
    const client = GphApiClient('dc6zaTOxFJmzC');
    client.random('gifs', { tag: 'bike', rating: 'pg' }).then(response => {
      this.setState({
        gif: response.data.images.original.gif_url,
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval);
  }

  renderStat(stat) {
    return <DataWell key={stat.title} title={stat.title} value={stat.value} />;
  }

  renderStats() {
    const { statData } = this.props;
    if (statData.size === 0) {
      return <Loader />;
    }

    return statData.map(stat => this.renderStat(stat));
  }

  renderGIF() {
    const { gif } = this.state;

    if (!gif) return <Loader />;

    return <img style={{ maxHeight: 500 }} src={gif} alt="Funny bike gif" />;
  }

  render() {
    return (
      <div>
        <div className="stat-container">{this.renderGIF()}</div>
        <h2>Usage Statistics</h2>
        <Segment className="stat-container">{this.renderStats()}</Segment>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  statData: state.stats,
});

HomeView.propTypes = {
  statData: PropTypes.instanceOf(List),
  fetchStats: PropTypes.func,
};

export default connect(mapStateToProps, {
  fetchStats: fetchStatsAction,
})(HomeView);
