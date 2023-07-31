# Use the official Node.js base image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the React app will run
EXPOSE 3000

# Command to start the React app
CMD ["npm", "start"]