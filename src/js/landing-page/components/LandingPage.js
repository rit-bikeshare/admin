import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import logo from '../../../img/logo.png';
import appStoreBadge from '../../../img/app-store-badge.svg';

const LandingPage = ({ history }) => {
  return (
    <div className="app">
      <div className="p-top-4 p-right-4">
        <Button
          floated="right"
          onClick={() => history.replace('/login')}
          secondary
        >
          Admin login
        </Button>
      </div>
      <div className="landing-container">
        <img alt="BikeShare" src={logo} className="logo" />
        <h3>Download the app, get riding</h3>
        <div className="app-store-badges">
          <a
            href="https://play.google.com/store/apps/details?id=com.rit.bikeshare"
            className="google-play"
          >
            <img
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
            />
          </a>
          <img
            alt="Download on the App Store"
            src={appStoreBadge}
            className="app-store"
          />
        </div>
      </div>
      <div className="legal-bs">
        <p>
          Google Play and the Google Play logo are trademarks of Google LLC.
        </p>
        <p>
          Apple and the Apple logo are trademarks of Apple Inc., registered in
          the U.S. and other countries. App Store is a service mark of Apple
          Inc., registered in the U.S. and other countries.
        </p>
      </div>
    </div>
  );
};

LandingPage.propTypes = {
  history: PropTypes.object,
};

export default LandingPage;
