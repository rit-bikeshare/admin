import React from 'react';
import { PropTypes } from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Nav from 'nav/components/NavView';
import navConfig from 'nav/constants/navConfig';

import Home from 'home/components/HomeView';
import Bikes from 'bikes/components/BikesView';
import BikeRacks from 'bike-racks/components/BikeRacksView';

class AppContainer extends React.Component {
  getActiveItem() {
    const { history } = this.props;
    const currentPath = history.location.pathname;

    return navConfig.find(navItem => {
      return navItem.get('route') === currentPath;
    });
  }

  render() {
    const activeItem = this.getActiveItem();
    let activeKey = 'HOME';

    if (activeItem) {
      activeKey = activeItem.get('key');
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
};

export default AppContainer;
