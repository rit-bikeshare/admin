import { fromJS } from 'immutable';
import getBaseRequestUrl from './utils/getBaseRequestUrl';

export default class RequestManager {
  constructor(getToken) {
    this.baseApiUrl = getBaseRequestUrl();
    this.getToken = getToken;
  }

  get(url) {
    // always add a trailing slash
    url = url.replace(/\/?$/, '/');
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
      return Promise.reject({ code: response.status, message: error.detail });
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
