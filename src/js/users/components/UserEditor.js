import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Loader, Header, Message } from 'semantic-ui-react';
import { update as editUser } from '../actions/userActions';
import User from '../records/User';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      ...props.user.toJS(),
    };
  }

  componentWillUnmount() {
    const { close } = this.props;
    close();
  }

  renderMessage() {
    const { status, error = '' } = this.props;
    if (status === 'FAILED') {
      return (
        <Message visible error header="Something went wrong" content={error} />
      );
    }

    if (status === 'SUCCEEDED') {
      return <Message visible success header="Success" />;
    }

    return null;
  }

  renderButtons() {
    const { status, save, close } = this.props;
    if (status === 'PENDING') {
      return <Loader active inline="centered" />;
    }

    return (
      <div>
        {this.renderMessage()}
        <Button onClick={() => close()}>Back</Button>
        <Button type="submit" onClick={() => save(new User(this.state))}>
          Submit
        </Button>
      </div>
    );
  }

  render() {
    const { id, isStaff } = this.state;

    return (
      <div>
        {this.renderDeleteModal()}
        <Header as="h3">{id ? 'Edit Bike' : 'Create Bike'}</Header>
        <Form>
          <Form.Checkbox
            checked={isStaff}
            label="This user is visible for checkout."
            onChange={(_, { checked: isStaff }) => {
              this.setState({ isStaff });
            }}
          />
          {this.renderButtons()}
        </Form>
      </div>
    );
  }
}

Editor.propTypes = {
  status: PropTypes.string,
  error: PropTypes.object,
  user: PropTypes.instanceOf(User),
  /* dispatch */
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  bike: state.bikeEditor.get('bike'),
});

const mapDispatchToProps = dispatch => ({
  save: bike => dispatch(editUser(bike)),
  //close: () => dispatch(editorAction({})),
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
