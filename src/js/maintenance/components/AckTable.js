import React from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { Button, Modal, List } from 'semantic-ui-react';

import BoolIcon from 'lib/components/BoolIcon';
import DamageReportsTable from './DamageReportsTable';

class AckTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportDetail: null,
    };
    this.handleDetailClose = this.handleDetailClose.bind(this);
    this.renderReportActions = this.renderReportActions.bind(this);
  }

  openDetailsModal(report) {
    this.setState({
      reportDetail: report,
    });
  }

  handleDetailClose() {
    this.setState({
      reportDetail: null,
    });
  }

  renderReport(report) {
    const { id, comments, damageType, critical } = report;
    return (
      <List.Item key={id}>
        <List>
          <List.Item className="m-bottom-2">
            <List.Header>Report ID</List.Header>
            {id}
          </List.Item>
          <List.Item className="m-bottom-2">
            <List.Header>Damage Type</List.Header>
            {damageType}
          </List.Item>
          <List.Item className="m-bottom-2">
            <List.Header>Comments</List.Header>
            {comments}
          </List.Item>
          <List.Item className="m-bottom-2">
            <List.Header>Bike can function</List.Header>
            <BoolIcon value={!critical} />
          </List.Item>
        </List>
      </List.Item>
    );
  }

  renderDetailsModal() {
    const { reportDetail } = this.state;

    if (!reportDetail) return null;
    const reports = reportDetail.get('reports');
    const bikeId = reports.first().bike;

    return (
      <Modal onClose={this.handleDetailClose} open={true} closeIcon={true}>
        <Modal.Header>Damage Details</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <h4>Reports for bike #{bikeId}</h4>
            <List divided relaxed>
              {reports.map(report => this.renderReport(report))}
            </List>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }

  renderReportActions(id, data) {
    return (
      <div className="actions">
        <Button size="tiny" compact onClick={() => this.openDetailsModal(data)}>
          Details
        </Button>
        <Button size="tiny" compact>
          Finish Maintenance
        </Button>
      </div>
    );
  }

  render() {
    const { damageReports } = this.props;
    return (
      <span>
        {this.renderDetailsModal()}
        <DamageReportsTable
          renderReportActions={this.renderReportActions}
          damageReports={damageReports}
        />
      </span>
    );
  }
}

AckTable.propTypes = {
  damageReports: PropTypes.instanceOf(Map),
};

export default AckTable;
