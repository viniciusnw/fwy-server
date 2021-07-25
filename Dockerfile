#*** Build Image ******************************************************************

# Pull base image
FROM node:16.5.0-alpine3.11

# Install Basic Packages
RUN npm install -g nodemon

# Create app directory
RUN mkdir /app
WORKDIR /app
COPY . ./app

# Expose door
EXPOSE 4000
EXPOSE 4001
EXPOSE 56745