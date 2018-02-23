import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookies';
import queryString from 'query-string';
import 'isomorphic-fetch';
import Main from './components/views/Main';
import Login from './components/views/Login';
import 'semantic-ui-css/semantic.min.css';

class Root extends Component {
  constructor(props) {
    super(props);

    const {
      access_token: accessToken, expires_in: expiresIn, state
    } = queryString.parse(window.location.hash.substring(1));

    if ((accessToken && expiresIn && state) && state === cookie.load('state')) {
      cookie.save('accessToken', accessToken, { path: '/' });
      cookie.save('expiresIn', expiresIn, { path: '/' });

      window.opener.location.reload();
      window.close();
    }

    this.state = {
      accessToken: cookie.load('accessToken'),
      expiresIn: cookie.load('expiresIn'),
    };
  }

  render() {
    const { accessToken } = this.state;

    if (accessToken) {
      return <Main accessToken={accessToken} />;
    }

    return <Login />;
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
