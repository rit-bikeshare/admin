import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import {
  Input,
  Button,
  Form,
  Loader,
  Header,
  Message,
} from 'semantic-ui-react';
import {
  getSettings as getSettingsAction,
  saveSettings as saveSettingsAction,
} from '../redux/settings';

// features
// const DROP_ANYWHERE = 'ENABLE_DROP_ANYWHERE';
const RENTAL_LENGTH = 'RENTAL_LENGTH';

//maintenance
const ALLOW_CHECKOUT = 'ALLOW_CHECKOUT';
const CHECKOUT_DISALLOWED_MESSAGE = 'CHECKOUT_DISALLOWED_MESSAGE';
const MAINTENANCE_MODE = 'MAINTENANCE_MODE';
const MAINTENANCE_MESSAGE = 'MAINTENANCE_MESSAGE';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { status: '', error: null, settings: Map() };
    this.updateRentalLength = this.updateRentalLength.bind(this);
  }

  componentDidMount() {
    const { getSettings } = this.props;
    getSettings();
  }

  save() {
    const { saveSettings } = this.props;
    const { settings } = this.state;
    saveSettings(settings.map(s => s.get('value')))
      .then(() => this.setState({ status: 'SUCCEEDED', error: null }))
      .catch(e => this.setState({ status: 'FAILED', error: e }))
      .finally(next => {
        setTimeout(() => this.setState({ status: '', error: null }), 5000);
        return next;
      });

    this.setState({ status: 'PENDING' });
  }

  updateRentalLength(e, { value }) {
    const { settings: propSettings } = this.props;
    const hours = parseInt(value, 10);
    const seconds = hours * 3600;
    this.setState(({ settings }) => ({
      settings: settings.set(
        RENTAL_LENGTH,
        propSettings.get(RENTAL_LENGTH).set('value', seconds)
      ),
    }));
  }

  renderMessage() {
    const { status, error = '' } = this.state;
    if (status === 'FAILED') {
      return (
        <Message
          visible
          error
          header="Something went wrong"
          content={JSON.stringify(error)}
        />
      );
    }

    if (status === 'SUCCEEDED') {
      return <Message visible success header="Settings saved!" />;
    }

    return null;
  }

  renderButtons() {
    const { status } = this.state;
    if (status === 'PENDING') {
      return <Loader active inline="centered" />;
    }

    return (
      <div>
        <Button primary type="submit" onClick={() => this.save()}>
          Save Settings
        </Button>
        {this.renderMessage()}
      </div>
    );
  }

  render() {
    const { settings: propSettings } = this.props;
    const { settings: stateSettings } = this.state;

    const settings = propSettings.merge(stateSettings);

    return (
      <div>
        <Header as="h3">Settings</Header>
        <Form>
          <Header as="h4">Features</Header>
          {/* <Form.Checkbox
            checked={settings.getIn([DROP_ANYWHERE, 'value'], false)}
            label="Enable Drop Anywhere"
            onChange={(_, { checked }) => {
              this.setState(({ settings }) => ({
                settings: settings.set(
                  DROP_ANYWHERE,
                  propSettings.get(DROP_ANYWHERE).set('value', checked)
                ),
              }));
            }}
          /> */}
          <Form.Field>
            <label>Rental Length (hours)</label>
            <Input
              placeholder="24"
              value={settings.getIn([RENTAL_LENGTH, 'value']) / 3600}
              onChange={this.updateRentalLength}
            />
          </Form.Field>
          <Header as="h4">Maintenance</Header>
          <Form.Checkbox
            checked={settings.getIn([ALLOW_CHECKOUT, 'value'], false)}
            label="Allow Checkout"
            onChange={(_, { checked }) => {
              this.setState(({ settings }) => ({
                settings: settings.set(
                  ALLOW_CHECKOUT,
                  propSettings.get(ALLOW_CHECKOUT).set('value', checked)
                ),
              }));
            }}
          />
          <Form.Field>
            <label>Checkout Disallowed Message</label>
            <Input
              placeholder="Sorry, checkouts are disabled right now!"
              value={settings.getIn([CHECKOUT_DISALLOWED_MESSAGE, 'value'])}
              onChange={(e, { value }) => {
                this.setState(({ settings }) => ({
                  settings: settings.set(
                    CHECKOUT_DISALLOWED_MESSAGE,
                    propSettings
                      .get(CHECKOUT_DISALLOWED_MESSAGE)
                      .set('value', value)
                  ),
                }));
              }}
            />
          </Form.Field>
          <Form.Checkbox
            checked={settings.getIn([MAINTENANCE_MODE, 'value'], false)}
            label="Maintenance Mode (Disable System)"
            onChange={(_, { checked }) => {
              this.setState(({ settings }) => ({
                settings: settings.set(
                  MAINTENANCE_MODE,
                  propSettings.get(MAINTENANCE_MODE).set('value', checked)
                ),
              }));
            }}
          />
          <Form.Field>
            <label>Maintenance Message</label>
            <Input
              placeholder="Sorry, BikeShare is undergoing maintenance."
              value={settings.getIn([MAINTENANCE_MESSAGE, 'value'])}
              onChange={(e, { value }) => {
                this.setState(({ settings }) => ({
                  settings: settings.set(
                    MAINTENANCE_MESSAGE,
                    propSettings.get(MAINTENANCE_MESSAGE).set('value', value)
                  ),
                }));
              }}
            />
          </Form.Field>
          {this.renderButtons()}
        </Form>
      </div>
    );
  }
}

Settings.propTypes = {
  settings: PropTypes.object.isRequired,
  /* dispatch */
  getSettings: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
};

const transform = settings => {
  return settings
    .get('settings', List())
    .toMap()
    .mapKeys((_, v) => v.get('name'));
};

const mapStateToProps = state => ({
  settings: transform(state.settings.get('data')),
});

const mapDispatchToProps = {
  getSettings: getSettingsAction,
  saveSettings: saveSettingsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
