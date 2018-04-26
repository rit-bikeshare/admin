import { createSelector } from 'reselect';
import { List, Map } from 'immutable';

const getDamageReports = state => state.damageReports;
const getBikes = state => state.bikes.get('data');

/**
 * This outputs a map:
 *  {
 *     [bikeId]: {
 *       bike: [bike data],
 *       reports: [list of damage reports]
 *     }
 *  }
 */
export default createSelector([getDamageReports, getBikes], (reports, bikes) =>
  reports
    .filter(report => !report.acknowledged)
    .reduce(
      (acc, report) =>
        acc
          .updateIn([report.bike, 'reports'], (reports = List()) =>
            reports.push(report)
          )
          .setIn([report.bike, 'bike'], bikes.get(report.bike)),
      Map()
    )
);
