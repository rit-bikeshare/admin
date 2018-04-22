import React from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import fetchDamageReportsAction from '../actions/fetchDamageReports';
import deleteDamageReportAction from '../actions/deleteDamageReport';
import getUnAckedDamageReports from '../selectors/getUnAckedDamageReports';
import getAckedDamageReports from '../selectors/getAckedDamageReports';
import AckTable from './AckTable';
import UnAckTable from './UnAckTable';

class MaintenanceView extends React.Component {
  componentWillMount() {
    const { fetchDamageReports } = this.props;
    fetchDamageReports();
  }

  render() {
    const {
      unAckedDamageReports,
      ackedDamageReports,
      deleteDamageReport,
    } = this.props;
    return (
      <div>
        <h2>Undergoing maintenance</h2>
        <AckTable damageReports={ackedDamageReports} />
        <h2>Damage reports</h2>
        <UnAckTable
          damageReports={unAckedDamageReports}
          deleteDamageReport={deleteDamageReport}
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
};

const mapStateToProps = state => ({
  unAckedDamageReports: getUnAckedDamageReports(state),
  ackedDamageReports: getAckedDamageReports(state),
});

export default connect(mapStateToProps, {
  fetchDamageReports: fetchDamageReportsAction,
  deleteDamageReport: deleteDamageReportAction,
})(MaintenanceView);
