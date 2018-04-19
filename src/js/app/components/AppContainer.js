import React from 'react';
import { PropTypes } from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import Nav from 'nav/components/NavView';
import navConfig from 'nav/constants/navConfig';

import Home from 'home/components/HomeView';
import Bikes from 'bikes/components/BikesView';
import BikeRacks from 'bike-racks/components/BikeRacksView';
import LoadingPage from './LoadingPage';
import UserData, { isEmpty, isFetched } from 'auth/records/UserData';
import { fetchUserData as fetchUserDataAction } from 'auth/actions/authActions';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentWillMount() {
    const { userData, history, fetchUserData } = this.props;
    if (isEmpty(userData)) {
      history.replace('/');
      return;
    }

    fetchUserData();
  }

  componentDidMount() {
    const { userData, history } = this.props;
    if (isFetched(userData)) {
      this.setState({
        loading: false,
      });
      if (!userData.isStaff) {
        history.replace('/');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { userData: prevUserData } = this.props;
    const { userData, history } = nextProps;
    if (isEmpty(userData)) {
      history.replace('/');
    }

    if (!isFetched(prevUserData) && isFetched(userData)) {
      this.setState({
        loading: false,
      });
      if (!userData.isStaff) {
        history.replace('/');
      }
    }
  }

  getActiveItem() {
    const { history } = this.props;
    const currentPath = history.location.pathname;

    return navConfig.find(navItem => {
      return navItem.get('route') === currentPath;
    });
  }

  render() {
    const { loading } = this.state;
    const activeItem = this.getActiveItem();
    let activeKey = 'HOME';

    if (activeItem) {
      activeKey = activeItem.get('key');
    }

    if (loading) {
      return <LoadingPage />;
    }

    return (
      <div>
        <Nav key="nav" activeItem={activeKey} {...this.props} />
        <Container key="body" className="app-container">
          <Switch>
            <Route exact={true} path="/admin" component={Home} />
            <Route path="/admin/bikes" component={Bikes} />
            <Route path="/admin/bike-racks" component={BikeRacks} />
            <Route path="/admin/users" component={() => 'Users'} />
            <Route path="/admin/maintenance" component={() => 'Maintenance'} />
            <Route path="/admin/settings" component={() => 'Settings'} />
          </Switch>
        </Container>
      </div>
    );
  }
}

AppContainer.propTypes = {
  history: PropTypes.object,
  userData: PropTypes.instanceOf(UserData),
  fetchUserData: PropTypes.func,
};

const mapStateToProps = state => ({
  userData: state.userData,
});

export default connect(mapStateToProps, {
  fetchUserData: fetchUserDataAction,
})(AppContainer);
