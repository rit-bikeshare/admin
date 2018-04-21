import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const DataWell = ({ title, value, className, style }) => {
  const classes = classNames('data-well', className);
  return (
    <div className={classes} style={style}>
      <h4 className="data-well__title">{title}</h4>
      <h1 className="data-well__value">{value}</h1>
    </div>
  );
};

DataWell.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default DataWell;
