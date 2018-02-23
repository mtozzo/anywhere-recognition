import React, { Component } from 'react';
import { Header, Button, Segment } from 'semantic-ui-react'
import buildUrl from 'build-url';
import cookie from 'react-cookies';
import queryString from 'query-string';
import config from '../../config';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);

    const color = queryString.parse(window.location.search).color;

    this.state = {
      color: color ? color : '6e298d',
    };

    this.onLoginClick = this.onLoginClick.bind(this);
  }

  onLoginClick() {
    const { oauth2 } = config;
    const loginUrl = buildUrl(oauth2.url, {
      path: oauth2.authPath,
      queryParams: oauth2.authParams,
    });

    cookie.save('state', oauth2.authParams.state, { path: '/' });

    window.open(loginUrl, 'Login to Achievers', 'width=900,height=700');
  }

  render() {
    const { color } = this.state;

    const headerStyle = { background: `#${color}`, borderColor: `#${color}` };
    const panelStyle = { borderColor: `#${color}` };

    return (
      <div className="login">
        <Header as="h4" attached="top" inverted style={headerStyle}>Anywhere Recognition</Header>
        <Segment attached style={panelStyle}>
          <div className="login-content">
            <Header as="h5">Click below to login to Achievers</Header>
            <Button success onClick={this.onLoginClick}>
              Login
            </Button>
          </div>
        </Segment>
      </div>
    );
  }
}

export default Login;
