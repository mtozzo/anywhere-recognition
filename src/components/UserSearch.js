import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Label, Form, Input } from 'semantic-ui-react';

class UserSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModelOpen: false,
      isIncorrectInput: false,
    };
  }

  onAddMembersClick() {

  }

  render() {
    const { isModalOpen } = this.state;

    const modalTrigger = (
      <Label
        as="a"
        className="marginTop5 marginRight0"
        color="green"
        onClick={this.onAddMembersClick}
      >
        Add Members
      </Label>
    );

    return (
      <Modal open={isModalOpen} trigger={modalTrigger}>
        <Modal.Header>Find Member</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>

            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

UserSearch.propTypes = {
  nominees: PropTypes.array.isRequired,
};

export default UserSearch;
