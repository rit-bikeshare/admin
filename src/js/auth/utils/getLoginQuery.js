import getEnv from 'app/utils/getEnv';

export default function getLoginQuery() {
  switch (getEnv()) {
    case 'local':
      return 'admin-local';
    case 'qa':
      return 'admin-qa';
    case 'prod':
      return 'admin';
    default:
      return 'admin-local';
  }
}
