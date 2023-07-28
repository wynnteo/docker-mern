# Use a minimal Node.js base image 
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

RUN apt-get update && apt-get

# Copy only the package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install production dependencies (avoid installing devDependencies)
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Install nodemon for auto-restart capability
RUN npm i --location=global pm2
# Copy source directory
COPY . .

# Expose the port on which the application will run
EXPOSE 9000

CMD [ "npm", "run", "start-prod" ]