# pull base image
FROM resin/rpi-raspbian:latest

# grab newest 6.x version of node and install MongoDB
RUN \
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - \
apt-get update && \
apt-get install -y nodejs mongodb-server

# Defines our working directory in container
WORKDIR /usr/src/app

# start app
#CMD ["npm", "start"]
