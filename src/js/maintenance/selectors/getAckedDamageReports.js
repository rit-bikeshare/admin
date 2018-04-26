import { createSelector } from 'reselect';
import { List, Map } from 'immutable';

const getDamageReports = state => state.damageReports;

/**
 * This outputs a map:
 *  {
 *     [bikeId]: {
 *       reports: [list of damage reports]
 *     }
 *  }
 */
export default createSelector(getDamageReports, reports =>
  reports
    .filter(report => report.acknowledged)
    .reduce(
      (acc, report) =>
        acc.updateIn([report.bike, 'reports'], (reports = List()) =>
          reports.push(report)
        ),
      Map()
    )
);
