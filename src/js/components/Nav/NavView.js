import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Menu, Button } from 'semantic-ui-react';
import Logo from '../../../img/logo.png';
import nav from './nav';

export default class NavView extends Component {
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
        key={key}
        name={key}
        active={active}
        onClick={() => this.routeTo(route)}
      >
        {key === 'HOME' ? <img src={Logo} /> : label}
      </Menu.Item>
    );
  }

  render() {
    const activeItem = this.props.activeItem;

    const navMenuItems = nav
      .map((navItem, key) =>
        this.renderMenuItem({
          key,
          label: navItem.get('label'),
          route: navItem.get('route'),
          active: activeItem === key
        })
      )
      .toList();

    return (
      <div id="page_header">
        <Container>
          <Menu stackable>
            {navMenuItems}
            <Menu.Item position={'right'}>
              <Button>Sign out</Button>
            </Menu.Item>
          </Menu>
        </Container>
      </div>
    );
  }
}

NavView.propTypes = {
  history: PropTypes.object,
  activeItem: PropTypes.string
};

NavView.defaultProps = {
  activeItem: 'HOME'
};
