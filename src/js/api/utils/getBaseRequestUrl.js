import getEnv from 'app/utils/getEnv';

export default function getBaseRequestUrl() {
  switch (getEnv()) {
    case 'dev' || 'qa':
      return 'https://bikesharedev.rit.edu/api';
    case 'prod':
      return 'https://bikeshare.rit.edu/api';
    default:
      return 'https://bikesharedev.rit.edu/api';
  }
}
