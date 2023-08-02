# Use the official MongoDB image from Docker Hub
FROM mongo:latest

# Copy the init-mongo.js script to the Docker container
COPY ./db/deploy/development/db-init.js /docker-entrypoint-initdb.d/

# Set environment variables for MongoDB configuration
ENV MONGO_INITDB_ROOT_USERNAME=dbadmin
ENV MONGO_INITDB_ROOT_PASSWORD=P1ssw0rd
ENV MONGO_INITDB_DATABASE=docker-mern-mongo

EXPOSE 27018

# Start MongoDB with the entrypoint script from the base image
CMD ["mongod"]