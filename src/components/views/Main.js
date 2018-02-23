import React, { Component } from 'react';
import { Dimmer, Loader, Segment, Header, Form, TextArea, Button, Message, Label, Modal, Input } from 'semantic-ui-react';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { getUsers } from '../../api/users';
import { optionsRecognitions, postRecognitions } from '../../api/recognitions';
import './Main.css';
import UserPills from "../UserPills";
import RecognitionOptions from "../RecognitionOptions";

class Main extends Component {
  constructor(props) {
    super(props);

    const color = queryString.parse(window.location.search).color;

    this.state = {
      isLoading: false,
      error: null,
      nominees: [],
      options: [],
      recognitionText: '',
      criterionId: 0,
      color: color ? color : '6e298d',
      didPostRecognition: false,
      searchText: '',
      isModalOpen: false,
      newMembersToAdd: [],
      isLoadingSearch: false,
      noUsersFound: false,
      userAlreadyExists: false,
    };

    this.onRecognizeClick = this.onRecognizeClick.bind(this);
    this.updateCriterion = this.updateCriterion.bind(this);
    this.onRecognitionTextChange = this.onRecognitionTextChange.bind(this);
    this.onNewRecognitionClick = this.onNewRecognitionClick.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onModalAdd = this.onModalAdd.bind(this);
  }

  componentWillMount() {
    const { accessToken } = this.props;
    const email = queryString.parse(window.location.search).email;
    this.setState({ isLoading: true });
    let userPromise = '';

    if (email) {
      userPromise = getUsers(accessToken, email)
        .then(res => {
          this.setState({nominees: [res.items[0]]});
        })
        .catch(err => {
          this.setState({error: err, isLoading: false});
        });
    }

    const recognitionsPromise = optionsRecognitions(accessToken)
      .then(res => {
        this.setState({ options: res.items });
      })
      .catch(err => {
        this.setState({ error: err, isLoading: false });
      });

    Promise.all([userPromise, recognitionsPromise])
      .then(() => {
        this.setState({ isLoading: false });
      });
  }

  onRecognizeClick() {
    const { accessToken } = this.props;
    const { nominees, recognitionText, criterionId } = this.state;

    if (nominees.length === 0 || recognitionText === '' || criterionId === 0) {
      alert('You must recognize someone with a reason and a selected recognition type');
      return;
    }

    this.setState({ isLoading: true });

    postRecognitions(accessToken, nominees, recognitionText, criterionId)
      .then(() => {
        this.setState({ didPostRecognition: true, isLoading: false });
      })
      .catch(err => {
        this.setState({ error: err, isLoading: false });
      });
  }

  updateCriterion(criterionId) {
    this.setState({ criterionId });
  }

  onRecognitionTextChange(e) {
    this.setState({ recognitionText: e.target.value });
  }

  onNewRecognitionClick() {
    let { nominees } = this.state;

    if (!queryString.parse(window.location.search).email) {
      nominees = [];
    } else {
      nominees = nominees.slice(0, 1);
    }

    this.setState({ didPostRecognition: false, recognitionText: '', criterionId: 0, nominees });
  }

  openModal() {
    this.setState({ searchText: '', newMembersToAdd: [], isModalOpen: true, noUsersFound: false, userAlreadyExists: false });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  onSearchChange(e) {
    this.setState({ searchText: e.target.value });
  }

  onSearchClick() {
    const { accessToken } = this.props;
    const { searchText, newMembersToAdd, nominees } = this.state;

    this.setState({ isLoadingSearch: true });
    getUsers(accessToken, searchText)
      .then(res => {
        if (res.items.length === 0) {
          this.setState({ isLoadingSearch: false, noUsersFound: true });
          return;
        }
        if (nominees.some(nominee => nominee.id === res.items[0].id) || newMembersToAdd.some(newMember => newMember.id === res.items[0].id)) {
          this.setState({ isLoadingSearch: false, userAlreadyExists: true });
          return;
        }
        newMembersToAdd.push(res.items[0]);
        this.setState({ newMembersToAdd, isLoadingSearch: false, searchText: '', noUsersFound: false, userAlreadyExists: false });
      })
      .catch(err => {
        this.setState({ error: err, isLoadingSearch: false });
      });
  }

  onModalAdd() {
    const { newMembersToAdd, nominees } = this.state;

    this.setState({ nominees: [].concat(nominees, newMembersToAdd) });
    this.setState({ isModalOpen: false });
  }

  render() {
    const { userAlreadyExists, isLoading, color, nominees, recognitionText, options, error, didPostRecognition, searchText, isModalOpen, newMembersToAdd, isLoadingSearch, noUsersFound } = this.state;

    const headerStyle = { background: `#${color}`, borderColor: `#${color}` };
    const panelStyle = { borderColor: `#${color}` };

    let content = (
      <div className="anywhereRecognition-content">
        <div className="userPills">
          <UserPills nominees={nominees} />
          <Modal open={isModalOpen} trigger={<Label as="a" className="marginTop5" color="green" onClick={this.openModal}>Add More</Label>}>
            <Modal.Header>Find Member</Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <Input error={noUsersFound} fluid size="small" value={searchText} onChange={this.onSearchChange} action={{ loading: isLoadingSearch, icon: 'search', onClick: this.onSearchClick }} placeholder="Search..." />
                  { noUsersFound ? <Label pointing>No users found!</Label> : '' }
                  { userAlreadyExists ? <Label pointing>User is already a nominee!</Label> : '' }
                </Form.Field>
              </Form>
              <Modal.Description>
                <UserPills nominees={newMembersToAdd} />
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeModal}>Cancel</Button>
              <Button positive onClick={this.onModalAdd}>Add</Button>
            </Modal.Actions>
          </Modal>
        </div>
        <div className="recognitionText">
          <Form>
            <TextArea
              placeholder="Give a reason for this recognition"
              value={recognitionText}
              onChange={this.onRecognitionTextChange}
            />
          </Form>
        </div>
        <div className="recognitionOptions">
          <RecognitionOptions options={options} updateCriterion={this.updateCriterion} />
        </div>
        <div className="submitRecognition">
          <Button positive floated="right" onClick={this.onRecognizeClick}>Recognize</Button>
        </div>
      </div>
    );

    if (isLoading) {
      content = <div className="anywhereRecognition-content" />;
    }

    if (error) {
      content = (
        <div className="anywhereRecognition-content">
          <Message negative>
            <Message.Header>Something Bad Happened :(</Message.Header>
            <p>Please refresh the page to load this content again</p>
            <p>Give this to the nearest developer: {error.message}</p>
          </Message>
        </div>
      );
    }

    if (didPostRecognition) {
      content = (
        <div className="anywhereRecognition-content">
          <Message success>
            <Message.Header>The Recognition was Sent!</Message.Header>
            <p>Click below if you'd like to make another one</p>
            <Button onClick={this.onNewRecognitionClick}>Write Another</Button>
          </Message>
        </div>
      );
    }

    return (
      <div className="anywhereRecognition">
        <Header as="h4" attached="top" inverted style={headerStyle}>Anywhere Recognition</Header>
        <Segment attached style={panelStyle}>
          <Dimmer active={isLoading} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
          {content}
        </Segment>
      </div>
    )
  }
}

Main.propTypes = {
  accessToken: PropTypes.string.isRequired,
};

export default Main;
