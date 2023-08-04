# Stage 1: Build the React app
FROM node:18 AS build
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ ./

ENV REACT_APP_API_SERVER=$LOADBALANCER_DNS_NAME
RUN npm run build

# Stage 2: Serve the React app using Nginx
FROM nginx:1.21
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/deploy/production/default.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 80
CMD /bin/bash -c "envsubst '\$LOADBALANCER_DNS_NAME' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"