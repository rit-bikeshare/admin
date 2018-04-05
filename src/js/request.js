import { fromJS } from 'immutable';

const baseApiUrl = 'http://spin.se.rit.edu';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsImV4cCI6MTU1NDEzMTk4MiwidXNlcm5hbWUiOiJ0ZXN0IiwidXNlcl9pZCI6MX0.SSu3op-0P9OxVe5WKScWbFRHm5yeSRl8gxGu4KVWfNs';

const tokenHeader = {
  Authorization: 'JWT ' + token
};

export function get(url) {
  // always add a trailing slash
  url = url.replace(/\/?$/, '/');
  return fetch(`${baseApiUrl}/${url}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...tokenHeader
    }
  }).then(async response => {
    if (response.ok) return response.json().then(fromJS);

    const error = await response.json();
    return Promise.reject({ code: response.status, message: error.detail });
  });
}

export function post(url, body) {
  // always add a trailing slash
  url = url.replace(/\/?$/, '/');
  return fetch(`${baseApiUrl}/${url}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...tokenHeader
    },
    body: JSON.stringify(body)
  }).then(async response => {
    if (response.ok) return response.json().then(fromJS);

    const error = await response.json();

    return Promise.reject({
      code: response.status,
      message: error.detail
    });
  });
}
