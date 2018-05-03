<p align="center"><img width="350px" src ="https://raw.githubusercontent.com/rit-bikeshare/admin/master/src/img/logo.png" /></p>

[![Build Status](https://travis-ci.org/rit-bikeshare/admin.svg?branch=master)](https://travis-ci.org/rit-bikeshare/admin)

This is the react BikeShare admin app.

We use travis to automatically build and publish new javascript versions.

## Docs

#### Dependencies
Yarn is used to install and manage dependencies, but npm should also be compatible without much work.
If using OSX, installing yarn is easiest with homebrew:

```brew install yarn```

Otherwise, follow installation instructions from https://yarnpkg.com
And finally,

```
yarn install
yarn start
```

Will install any dependencies and start the development server. 

#### Prettier / eslint
Prettier and eslint are used to keep the codebases styling consistent. These should both be setup automatically once running `yarn install` but, if you are having trouble with the githooks not linting code, you can try running the fix-githooks script `sh ./bin/fix-githooks`. These are required for development but encouraged, especially when multiple people are committing code to a project.

#### Hostname / dns
In order to get authentication working locally, you need to spoof your dns resolver to direct `local.spin.se.rit.edu` to `localhost`. If you are on OSX, this is pretty easy to achieve using the /etc/hosts file and a port redirect process that will send traffic from port 80 to the port webpack-dev-server is listening on.
Note that the yarn scripts to setup this system on OSX does make a slight modification to your `/etc/hosts` file and requires root access (it will prompt you for your password).

#### Travis
We use travis for our CI for our build and deploy. Every deploy made with a version number will automatically deploy on travis.

##### Making a new version
Making a new version of the bike share app is easy. All you have to do is use the `version` command.
```bash
$ yarn version
```
This will prompt you to input a new version number.

##### The difference between major and minor versions
Major versions should be changes that add new features or make large changes to existing features.
Minor versions should be all other changes like bug fixes and the like.

##### Testing
Tests will run on all prs and master.
