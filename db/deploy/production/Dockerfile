# Use the official MongoDB image from Docker Hub
FROM mongo:latest

COPY ./deploy/production/db-init.js /docker-entrypoint-initdb.d/

# Set environment variables for MongoDB configuration
ENV MONGO_INITDB_ROOT_USERNAME=dbadmin
ENV MONGO_INITDB_ROOT_PASSWORD=P1ssw0rd
ENV MONGO_INITDB_DATABASE=docker-mern-mongo

EXPOSE 27018

# Start MongoDB with the entrypoint script from the base image
CMD ["mongod"]