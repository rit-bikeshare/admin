import React from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import fetchDamageReportsAction from '../actions/fetchDamageReports';
import deleteDamageReportAction from '../actions/deleteDamageReport';
import ackDamageReportAction from '../actions/ackDamageReport';
import submitMaintenanceReportAction from '../actions/submitMaintenanceReport';

import getUnAckedDamageReports from '../selectors/getUnAckedDamageReports';
import getAckedDamageReports from '../selectors/getAckedDamageReports';

import AckTable from './AckTable';
import UnAckTable from './UnAckTable';
import MaintenanceReportEditor from './MaintenanceReportEditor';

class MaintenanceView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportEditorOpen: false,
      reportsToClose: null,
      bikeId: null,
    };

    this.closeReportEditor = this.closeReportEditor.bind(this);
    this.submitMaintenanceReport = this.submitMaintenanceReport.bind(this);
    this.openMaintenanceReportEditor = this.openMaintenanceReportEditor.bind(
      this
    );
  }

  componentWillMount() {
    const { fetchDamageReports } = this.props;
    fetchDamageReports();
    this.pollInterval = setInterval(() => fetchDamageReports(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval);
  }

  openMaintenanceReportEditor(bikeId) {
    const { ackedDamageReports } = this.props;
    const reportIds = ackedDamageReports
      .getIn([bikeId, 'reports'])
      .map(report => report.id);
    this.setState({
      reportEditorOpen: true,
      reportsToClose: reportIds,
      bikeId,
    });
  }

  closeReportEditor() {
    this.setState({
      reportEditorOpen: false,
      reportsToClose: null,
      bikeId: null,
    });
  }

  submitMaintenanceReport({ damageReports, comments }) {
    const { bikeId } = this.state;
    const { submitMaintenanceReport } = this.props;
    submitMaintenanceReport({ damageReports, comments, bike: bikeId });
    this.closeReportEditor();
  }

  render() {
    const { reportEditorOpen, reportsToClose } = this.state;
    const {
      unAckedDamageReports,
      ackedDamageReports,
      deleteDamageReport,
      ackDamageReport,
    } = this.props;

    if (reportEditorOpen) {
      return (
        <MaintenanceReportEditor
          reportsToClose={reportsToClose}
          onCancel={this.closeReportEditor}
          onSubmit={this.submitMaintenanceReport}
        />
      );
    }

    return (
      <div>
        <h2>Undergoing maintenance</h2>
        <AckTable
          damageReports={ackedDamageReports}
          createMaintenanceReport={this.openMaintenanceReportEditor}
        />
        <h2>Damage reports</h2>
        <UnAckTable
          damageReports={unAckedDamageReports}
          deleteDamageReport={deleteDamageReport}
          ackDamageReport={ackDamageReport}
        />
      </div>
    );
  }
}

MaintenanceView.propTypes = {
  unAckedDamageReports: PropTypes.instanceOf(Map),
  ackedDamageReports: PropTypes.instanceOf(Map),
  fetchDamageReports: PropTypes.func,
  deleteDamageReport: PropTypes.func,
  ackDamageReport: PropTypes.func,
  submitMaintenanceReport: PropTypes.func,
};

const mapStateToProps = state => ({
  unAckedDamageReports: getUnAckedDamageReports(state),
  ackedDamageReports: getAckedDamageReports(state),
});

export default connect(mapStateToProps, {
  fetchDamageReports: fetchDamageReportsAction,
  deleteDamageReport: deleteDamageReportAction,
  ackDamageReport: ackDamageReportAction,
  submitMaintenanceReport: submitMaintenanceReportAction,
})(MaintenanceView);
