import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon, List } from 'semantic-ui-react';

class RecognitionOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeOptionIndex: 0,
      activeCriterionId: -1,
    };

    this.onOptionClick = this.onOptionClick.bind(this);
    this.onCriterionClick = this.onCriterionClick.bind(this);
  }

  onCriterionClick(e, { value }) {
    const { updateCriterion } = this.props;

    updateCriterion(value);
    this.setState({ activeCriterionId: value });
  }

  renderCriterion(criterion, i) {
    const { activeCriterionId } = this.state;
    const { id, name } = criterion;

    return (
      <List.Item key={i} value={id} active={activeCriterionId === id} onClick={this.onCriterionClick}>
        {name}
      </List.Item>
    )
  }

  onOptionClick(e, { index }) {
    this.setState({ activeOptionIndex: index });
  }

  renderOption(option, i) {
    const { activeOptionIndex } = this.state;
    const { name, criteria } = option;

    const renderedCriterias = criteria.map((criterion, i) => this.renderCriterion(criterion, i));

    return (
      <div key={i}>
        <Accordion.Title active={activeOptionIndex === i} index={i} onClick={this.onOptionClick}>
          <Icon name='dropdown' />
          {name}
        </Accordion.Title>
        <Accordion.Content active={activeOptionIndex === i}>
          <div className="criterias">
            <List selection verticalAlign="middle">
              {renderedCriterias}
            </List>
          </div>
        </Accordion.Content>
      </div>
    )
  }

  render() {
    const { options } = this.props;

    const renderedOptions = options.map((option, i) => this.renderOption(option, i));

    return (
      <Accordion fluid>
        {renderedOptions}
      </Accordion>
    );
  }
}

RecognitionOptions.propTypes = {
  updateCriterion : PropTypes.func.isRequired,
  options         : PropTypes.arrayOf(PropTypes.shape({
    name          : PropTypes.string.isRequired,
    criteria      : PropTypes.arrayOf(PropTypes.shape({
      id          : PropTypes.string.isRequired,
      name        : PropTypes.string.isRequired,
    })).isRequired,
  })),
};

RecognitionOptions.defaultProps = {
  options: [],
};

export default RecognitionOptions;
