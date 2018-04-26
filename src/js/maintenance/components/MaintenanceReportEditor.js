import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { Button, Header, Form, TextArea } from 'semantic-ui-react';

class MaintenanceReportEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: '',
    };
    this.updateCommentContent = this.updateCommentContent.bind(this);
    this.submit = this.submit.bind(this);
  }

  updateCommentContent(e, { value }) {
    this.setState({
      comments: value,
    });
  }

  submit() {
    const { comments } = this.state;
    const { onSubmit, reportsToClose } = this.props;
    onSubmit({ damageReports: reportsToClose, comments });
  }

  renderButtons() {
    const { onCancel } = this.props;
    return (
      <div>
        <Button basic primary onClick={onCancel}>
          Cancel
        </Button>
        <Button primary type="submit" onClick={this.submit}>
          Submit
        </Button>
      </div>
    );
  }

  render() {
    const { reportsToClose } = this.props;
    const { comments } = this.state;
    return (
      <div>
        <Header as="h3">New Maintenance Report</Header>
        <p>This will close reports {reportsToClose.join(', ')}</p>
        <Form>
          <Form.Field>
            <label>Comments:</label>
            <TextArea
              autoHeight={true}
              value={comments}
              onChange={this.updateCommentContent}
            />
          </Form.Field>
          {this.renderButtons()}
        </Form>
      </div>
    );
  }
}

MaintenanceReportEditor.propTypes = {
  reportsToClose: PropTypes.instanceOf(List),
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default MaintenanceReportEditor;
