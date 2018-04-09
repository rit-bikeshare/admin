import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';

export const DeleteBikeModal = ({ id, onCancel, onDelete }) => {
  return (
    <Modal open={true} closeOnRootNodeClick={true} onClose={this.close}>
      <Modal.Header>Delete bike {id}</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this bike?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button negative onClick={() => onDelete()}>
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

DeleteBikeModal.propTypes = {
  id: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
