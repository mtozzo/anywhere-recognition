const DEVELOPMENT_API = 'https://your_site.sandbox.achievers.com';
const PRODUCTION_API = 'https://your_site.achievers.com';
const CLIENT_ID = 'your_client_id';

export default {
  oauth2: {
    url: DEVELOPMENT_API,
    authPath: '/oauth/v2/openIDConnectClient/authorize',
    authParams: {
      response_type: 'token',
      client_id: CLIENT_ID,
      scope: ['read'],
      state: Math.random(),
      nonce: 'test',
    }
  },
  api: {
    url: DEVELOPMENT_API,
    usersPath: '/api/v5/users',
    recognitionPath: '/api/v5/recognitions',
  },
};
