# pull base image
FROM resin/rpi-raspbian:latest

# install MongoDB
RUN apt-get update && apt-get install mongodb-server

# start app
#CMD ["npm", "start"]
