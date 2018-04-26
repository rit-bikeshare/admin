#!/bin/bash
set -ev

sshpass -p $SSH_PASSWORD ssh -oStrictHostKeyChecking=no $SSH_USERNAME@bikesharedev.rit.edu <<-'ENDSSH'
  rm -f dist.tar.gz
  curl -s https://api.github.com/repos/rit-bikeshare/admin/releases/latest \
  | grep "browser_download_url.*gz" \
  | cut -d '"' -f 4 \
  | wget -qi -

  tar -xvzf dist.tar.gz -C deploy
ENDSSH
