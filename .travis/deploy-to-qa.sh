#!/bin/bash
set -ev

ssh $SSH_USERNAME@bikesharedev.rit.edu <<-'ENDSSH'
  curl -s https://api.github.com/repos/rit-bikeshare/admin/releases/latest \
  | grep "browser_download_url.*gz" \
  | cut -d '"' -f 4 \
  | wget -qi -

  tar -xvzf dist.tar.gz -C deploy
ENDSSH
expect "assword:"
send "$SSH_PASSWORD\r"
interact
