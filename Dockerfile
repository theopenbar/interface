# pull base image
FROM resin/rpi-raspbian:latest
#FROM resin/raspberrypi3-node

# grab newest 6.x version of node and install MongoDB
RUN \
apt-get update && \
apt-get install -y curl mongodb-server \
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - \
apt-get install -y nodejs

# Defines our working directory in container
WORKDIR /usr/src/app

# start app
#CMD ["npm", "start"]
