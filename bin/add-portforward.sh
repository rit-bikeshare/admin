echo "rdr pass inet proto tcp from any to any port 80 -> 127.0.0.1 port 8080" | sudo pfctl -ef -
echo '127.0.0.1 local.bikesharedev.rit.edu' | sudo tee -a /etc/hosts
sudo killall -HUP mDNSResponder
