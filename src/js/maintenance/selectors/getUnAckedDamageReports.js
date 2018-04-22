import { createSelector } from 'reselect';

const getDamageReports = state => state.damageReports;

export default createSelector(getDamageReports, reports =>
  reports.filter(report => !report.acknowleged)
);
