# pull base image
FROM resin/rpi-raspbian:latest

RUN \
  # install MongoDB
  apt-get update && \
  apt-get install mongodb-server
  # start app
  CMD ["npm", "start"]
