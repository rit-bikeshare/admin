import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';

const meta = {
  bikes: {
    header: id => `Delete bike ${id}`,
    description: 'Are you sure you want to delete this bike?',
  },
  bikeracks: {
    header: id => `Delete bike rack ${id}`,
    description:
      'Deleting this bike rack will prevent any further check-ins at the rack.',
  },
  damageReports: {
    header: id => `Delete all reports for bike ${id}`,
    description: 'Deleting this item will remove all reports for this bike.',
  },
};

const DeleteModalView = ({ objectName, id, status, onCancel, onDelete }) => {
  return (
    <Modal open={true} closeOnRootNodeClick={true} onClose={this.close}>
      <Modal.Header>{meta[objectName].header(id)}</Modal.Header>
      <Modal.Content>
        <p>{meta[objectName].description}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          disabled={status === 'PENDING' || status === 'SUCCESS'}
          onClick={() => onCancel()}
        >
          Cancel
        </Button>
        {status === 'PENDING' ? (
          <Button loading>Delete</Button>
        ) : status === 'SUCCESS' ? (
          <Button positive>Success</Button>
        ) : status === 'ERROR' ? (
          <Button negative onClick={() => onDelete()}>
            Try again
          </Button>
        ) : (
          <Button negative onClick={() => onDelete()}>
            Delete
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
};

DeleteModalView.propTypes = {
  objectName: PropTypes.string,
  id: PropTypes.string,
  status: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

class DeleteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
  }

  render() {
    const { objectName, id, deleteFn, onDelete, onCancel } = this.props;
    const { status } = this.state;

    const handleDelete = () => {
      this.setState({ status: 'PENDING' });
      deleteFn({ id })
        .then(() => {
          setTimeout(() => {
            this.setState({ status: 'SUCCESS' });
            setTimeout(onDelete, 1500);
          }, 1000);
        })
        .catch(() => {
          this.setState({ status: 'ERROR' });
        });
    };

    return (
      <DeleteModalView
        id={id}
        objectName={objectName}
        status={status}
        onCancel={onCancel}
        onDelete={handleDelete}
      />
    );
  }
}

DeleteModal.propTypes = {
  id: PropTypes.string.isRequired,
  objectName: PropTypes.string.isRequired,
  deleteFn: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteModal;
