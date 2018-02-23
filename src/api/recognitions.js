import 'isomorphic-fetch';
import buildUrl from 'build-url';
import config from '../config';
import queryString from 'query-string';

function optionsRecognitions(accessToken) {
  const { api } = config;
  const url = buildUrl(api.url, {
    path: api.recognitionPath,
  });

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    method: 'OPTIONS',
  }).then(res => {
    if (res.status >= 200 && res.status < 300) {
      return res;
    }

    const err = new Error(res.statusText);
    err.res = res;
    throw err;
  }).then(res => res.json())
    .then(res => {
      res.items = res.items.filter(item => item.moduleType === 'FREE' && !item.name.includes('Email'));
      return res;
    });
}

function postRecognitions(accessToken, nominees, recognitionText, criterionId) {
  const { api } = config;
  const url = buildUrl(api.url, {
    path: api.recognitionPath,
  });

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    credentials: 'same-origin',
    method: 'POST',
    body: queryString.stringify({
      nominees: nominees.map(nominee => nominee.id).join(','),
      recognitionText,
      criterionId,
      useUserIds: true,
    }),
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
  optionsRecognitions,
  postRecognitions,
};
