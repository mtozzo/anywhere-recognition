import 'isomorphic-fetch';
import buildUrl from 'build-url';
import config from '../config';

function getUsers(accessToken, q = '') {
  const { api } = config;
  const url = buildUrl(api.url, {
    path: api.usersPath,
    queryParams: { q },
  });

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'same-origin',
  }).then(res => {
    if (res.status >= 200 && res.status < 300) {
      return res;
    }

    const err = new Error(res.statusText);
    err.res = res;
    throw err;
  }).then(res => res.json());
}

export {
  getUsers,
};
