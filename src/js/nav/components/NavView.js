import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Menu, Button } from 'semantic-ui-react';
import Icon from '../../../img/icon.png';
import NavConfig from '../constants/NavConfig';
import { clearUserData } from 'auth/actions/authActions';

class NavView extends Component {
  constructor(props) {
    super(props);
    this.routeTo = this.routeTo.bind(this);
  }

  routeTo(route) {
    const { history } = this.props;
    history.push(route);
  }

  renderMenuItem({ key, label, route, active }) {
    return (
      <Menu.Item
        className="home-nav-item"
        key={key}
        name={key}
        active={active}
        onClick={() => this.routeTo(route)}
      >
        {key === 'HOME' ? <img alt="Home" src={Icon} /> : label}
      </Menu.Item>
    );
  }

  render() {
    const { signOut, activeItem } = this.props;

    const navMenuItems = NavConfig.map((navItem, key) =>
      this.renderMenuItem({
        key,
        label: navItem.get('label'),
        route: navItem.get('route'),
        active: activeItem === key,
      })
    ).toList();

    return (
      <div id="page_header">
        <Container>
          <Menu stackable>
            {navMenuItems}
            <Menu.Item position={'right'} className="p-right-0">
              <Button secondary={true} onClick={signOut}>
                Sign out
              </Button>
            </Menu.Item>
          </Menu>
        </Container>
      </div>
    );
  }
}

NavView.propTypes = {
  history: PropTypes.object,
  activeItem: PropTypes.string,
  signOut: PropTypes.func,
};

NavView.defaultProps = {
  activeItem: 'HOME',
};

export default connect(null, {
  signOut: clearUserData,
})(NavView);
