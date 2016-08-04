FROM resin/rpi-raspbian:latest


RUN \
  # install MongoDB
  apt-get update && \
  apt-get install mongodb-server
  # start app
  ln -s /usr/src/app
