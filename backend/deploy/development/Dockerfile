FROM node:18
# Create app directory
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y vim
# Install app dependencies
COPY package*.json ./

RUN npm install
# Install nodemon for auto-restart capability
RUN npm i --location=global nodemon
# Copy source directory
COPY . .

EXPOSE 400
CMD [ "npm", "run", "start" ]