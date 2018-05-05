import getEnv from 'app/utils/getEnv';

export default function getBaseRequestUrl() {
  switch (getEnv()) {
    case 'dev' || 'qa':
      return 'https://api.bikesharedev.rit.edu/';
    case 'prod':
      return 'https://api.bikeshare.rit.edu/';
    default:
      return 'https://api.bikesharedev.rit.edu/';
  }
}
