import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import moment from 'moment';
import Chart from 'chart.js';

let chartId = 0;

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
    const { type, data, options } = this.props;
    var timeFormat = 'MM/DD/YYYY HH:mm';

    function newDate(days) {
      return moment()
        .add(days, 'd')
        .toDate();
    }

    function newDateString(days) {
      return moment()
        .add(days, 'd')
        .format(timeFormat);
    }

    new Chart(`chart_${this.chartId}`, {
      type: 'line',
      data: {
        labels: [
          // Date Objects
          newDate(0),
          newDate(1),
          newDate(2),
          newDate(3),
          newDate(4),
          newDate(5),
          newDate(6),
        ],
        datasets: [
          {
            label: 'My First dataset',
            fill: true,
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
                display: true,
                labelString: 'Date',
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'value',
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
