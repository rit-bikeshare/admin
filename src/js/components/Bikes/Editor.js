import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Loader, Header, Message } from 'semantic-ui-react';
import { editorAction, editBike } from '../../redux/bikes/actions';
import { Bike } from '../../redux/bikes/model';
import { DeleteBikeModal } from './DeleteBikeModal';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      ...props.bike.toJS()
    };
  }

  componentWillUnmount() {
    const { close } = this.props;
    close();
  }

  onDeleteBike(id) {}

  renderDeleteModal() {
    const { deleteModal, id } = this.state;
    if (!deleteModal) {
      return null;
    }

    return (
      <DeleteBikeModal
        id={id}
        onCancel={() => this.setState({ deleteModal: null })}
        onDelete={() => this.onDeleteBike(id)}
      />
    );
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

  renderButtons(showDelete = false) {
    const { status, save, close } = this.props;
    if (status === 'PENDING') {
      return <Loader active inline="centered" />;
    }

    const deleteButton = showDelete ? (
      <Button
        floated="right"
        negative
        onClick={() =>
          this.setState({
            deleteModal: true
          })
        }
      >
        Delete bike
      </Button>
    ) : null;

    return (
      <div>
        {this.renderMessage()}
        <Button onClick={() => close()}>Back</Button>
        <Button type="submit" onClick={() => save(new Bike(this.state))}>
          Submit
        </Button>
        {deleteButton}
      </div>
    );
  }

  render() {
    const { id, lock, visible } = this.state;
    const showDelete = Boolean(id);

    return (
      <div>
        {this.renderDeleteModal()}
        <Header as="h3">{id ? 'Edit Bike' : 'Create Bike'}</Header>
        <Form>
          {id ? (
            <Form.Field>
              <label>Bike id:</label>
              <input value={id} disabled />
            </Form.Field>
          ) : null}
          <Form.Field>
            <label>Lock id:</label>
            <input
              placeholder="Unique lock identifier"
              initialValue={lock}
              onChange={({ target: { value: lock } }) =>
                this.setState({ lock })
              }
            />
            {lock}
          </Form.Field>
          <Form.Checkbox
            checked={visible}
            label="This bike is visible for checkout."
            onChange={(_, { checked: visible }) => {
              this.setState({ visible });
            }}
          />
          {this.renderButtons(showDelete)}
        </Form>
      </div>
    );
  }
}

Editor.propTypes = {
  status: PropTypes.string,
  error: PropTypes.object,
  bike: PropTypes.string,
  /* dispatch */
  open: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    status: state.bikes.getIn(['editor', 'status']),
    error: state.bikes.getIn(['editor', 'error']),
    bike: state.bikes.getIn(['editor', 'bike'])
  };
};

const mapDispatchToProps = dispatch => ({
  open: bike => dispatch(editorAction({ active: true, bike })),
  save: bike => dispatch(editBike(bike)),
  close: () => dispatch(editorAction({}))
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
