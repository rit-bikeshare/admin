import { fromJS } from 'immutable';
import getBaseRequestUrl from './utils/getBaseRequestUrl';

function getQueryString(params) {
  var esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
}

export default class RequestManager {
  constructor(getToken) {
    this.baseApiUrl = getBaseRequestUrl();
    this.getToken = getToken;
  }

  get(url, query) {
    // always add a trailing slash
    url = url.replace(/\/?$/, '/');

    if (query) {
      url += `?${getQueryString(query)}`;
    }

    return fetch(`${this.baseApiUrl}/${url}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + this.getToken(),
      },
    }).then(async response => {
      if (response.ok) return response.json().then(fromJS);
      const error = await response.json();
      return Promise.reject({
        code: response.status,
        message: error.detail,
        error,
      });
    });
  }

  post(url, body) {
    // always add a trailing slash
    url = url.replace(/\/?$/, '/');
    return fetch(`${this.baseApiUrl}/${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + this.getToken(),
      },
      body: JSON.stringify(body),
    }).then(async response => {
      if (response.ok) return response.json().then(fromJS);
      const error = await response.json();
      return Promise.reject({
        code: response.status,
        message: error.detail,
        error,
      });
    });
  }

  put(url, body) {
    // always add a trailing slash
    url = url.replace(/\/?$/, '/');
    return fetch(`${this.baseApiUrl}/${url}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + this.getToken(),
      },
      body: JSON.stringify(body),
    }).then(async response => {
      if (response.ok) return response.json().then(fromJS);
      const error = await response.json();
      return Promise.reject({
        code: response.status,
        message: error.detail,
        error,
      });
    });
  }

  del(url) {
    // always add a trailing slash
    url = url.replace(/\/?$/, '/');
    return fetch(`${this.baseApiUrl}/${url}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + this.getToken(),
      },
    }).then(async response => {
      if (response.ok) return Promise.resolve(true);
      return Promise.reject(response);
    });
  }
}
