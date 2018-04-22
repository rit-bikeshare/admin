import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import moment from 'moment';
import Chart from 'chart.js';

Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontColor = '#33475b';

let chartId = 0;

const getDays = () => {
  return ['April 22 - Monday', 'April 23 - Tuesday'];
};

class ChartContainer extends Component {
  constructor(props) {
    super(props);
    this.chartId = chartId++;
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.drawChart();
  }

  drawChart() {
    //const { type, data, options } = this.props;
    var timeFormat = 'MM/DD/YYYY HH:mm';

    new Chart(`chart_${this.chartId}`, {
      type: 'line',
      data: {
        labels: getDays(),
        datasets: [
          {
            fill: true,
            label: 'Bikes rented',
            backgroundColor: 'rgba(228, 129, 58, 0.45)',
            data: [10, 12, 8, 4, 1, 2, 3],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        title: {
          text: 'Chart.js Time Scale',
        },
        scales: {
          xAxes: [
            {
              time: {
                format: timeFormat,
                tooltipFormat: 'll HH:mm',
              },
              scaleLabel: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Rentals',
              },
            },
          ],
        },
      },
    });
  }

  render() {
    return (
      <div className="chart">
        <canvas id={`chart_${this.chartId}`} height="300" />
      </div>
    );
  }
}

ChartContainer.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.object,
  options: PropTypes.object,
};

export default ChartContainer;
