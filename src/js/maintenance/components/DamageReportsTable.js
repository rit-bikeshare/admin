import React from 'react';
import moment from 'moment';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

class DamageReportsTable extends React.Component {
  renderReportRow(id, data) {
    const { renderReportActions } = this.props;

    const damageTypes = data.reports.map(report => report.damageType);
    const mostRecentReport = data.reports.first();
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{damageTypes.join(', ')}</Table.Cell>
        <Table.Cell>
          {moment(mostRecentReport.reportedAt).format('ll')}
        </Table.Cell>
        <Table.Cell>{renderReportActions(id, data)}</Table.Cell>
      </Table.Row>
    );
  }

  render() {
    const { damageReports } = this.props;
    return (
      <Table className="damage-report-table hoverable" selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>DAMAGE TYPE</Table.HeaderCell>
            <Table.HeaderCell>REPORT TIME</Table.HeaderCell>
            <Table.HeaderCell>ACTIONS</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {damageReports
            .map((data, id) => this.renderReportRow(id, data))
            .toList()}
        </Table.Body>
      </Table>
    );
  }
}

DamageReportsTable.propTypes = {
  damageReports: PropTypes.instanceOf(Map),
  renderReportActions: PropTypes.func,
};

export default DamageReportsTable;
