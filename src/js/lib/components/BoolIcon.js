import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

export default function BoolIcon({ value }) {
  if (value) {
    return <Icon name="check circle outline" color="green" />;
  }

  return <Icon name="cancel" color="red" />;
}

BoolIcon.propTypes = {
  value: PropTypes.bool,
};
