import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';

class UserPills extends Component {
  renderNominee(nominee, i) {
    return (
      <Label key={i} as="span" image>
        <img src={nominee.profileImageUrl} alt="" />
        {`${nominee.firstName} ${nominee.lastName}`}
      </Label>
    );
  }

  render() {
    const { nominees } = this.props;

    const labels = nominees.map((nominee, i) => this.renderNominee(nominee, i));

    return (
      <Label.Group>
        {labels}
      </Label.Group>
    );
  }
}

UserPills.propTypes = {
  nominees          : PropTypes.arrayOf(PropTypes.shape({
    profileImageUrl : PropTypes.string.isRequired,
    firstName       : PropTypes.string.isRequired,
    lastName        : PropTypes.string.isRequired,
  })),
};

UserPills.defaultProps = {
  nominees: [],
};

export default UserPills;
