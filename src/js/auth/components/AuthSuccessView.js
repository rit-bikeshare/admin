import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import queryString from 'query-string';

import setUserTokenAction from '../actions/setUserTokenAction';
import fetchUserDataAction from '../actions/fetchUserData';
import UserData, { isFetched } from '../records/UserData';

import logo from '../../../img/logo.png';

class AuthSuccessView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noToken: false,
    };
  }

  componentWillMount() {
    const { location, fetchUserData, setUserToken } = this.props;
    const params = queryString.parse(location.search);
    const { token } = params;

    if (!token) {
      this.setState({
        noToken: true,
      });
      return;
    }

    setUserToken(token);
    fetchUserData();
  }

  componentWillUpdate(nextProps) {
    const { userData: prevUserData } = this.props;
    const { userData } = nextProps;

    if (!isFetched(prevUserData) && isFetched(userData)) {
      this.routeToAdminHome();
    }
  }

  routeToAdminHome() {
    const { history } = this.props;
    history.replace('/admin');
  }

  render() {
    return (
      <div className="auth-success-container">
        <img alt="BikeShare" src={logo} className="logo" />
        <div className="loading-wrapper">
          <Loader active inline="centered" />
          <h3>Verifying Login...</h3>
        </div>
      </div>
    );
  }
}

AuthSuccessView.propTypes = {
  userData: PropTypes.instanceOf(UserData),
  history: PropTypes.object,
  location: PropTypes.object,
  fetchUserData: PropTypes.func,
  setUserToken: PropTypes.func,
};

const mapStateToProps = state => ({
  userData: state.userData,
});

export default connect(mapStateToProps, {
  setUserToken: setUserTokenAction,
  fetchUserData: fetchUserDataAction,
})(AuthSuccessView);