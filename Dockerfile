#*** Build Image ******************************************************************

# Pull base image
FROM node:12.16.1-alpine3.9

# Install Basic Packages
RUN npm install -g nodemon

# Create app directory
RUN mkdir /app
WORKDIR /app
COPY . ./app

# Expose door
EXPOSE 4000
EXPOSE 4001