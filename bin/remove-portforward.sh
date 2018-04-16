sudo sed -i '' '/127.0.0.1 local.bikesharedev.rit.edu/d' /etc/hosts
sudo pfctl -F all -f /etc/pf.conf
sudo killall -HUP mDNSResponder
