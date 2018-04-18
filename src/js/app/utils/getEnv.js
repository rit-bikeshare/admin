export default function getEnv() {
  switch (window.location.hostname) {
    case 'local.bikesharedev.rit.edu':
      return 'dev';
    case 'bikesharedev.rit.edu':
      return 'qa';
    case 'bikeshare.rit.edu':
      return 'prod';
    default:
      return 'dev';
  }
}
