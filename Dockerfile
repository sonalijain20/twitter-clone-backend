##
## Build Stage
##

FROM node:14-alpine AS BUILD_IMAGE

# Bring in the latest npm
RUN npm i npm@latest -g

# Copy just the package files so we skip install if nothing changed
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm i --production

# Copy over all other files
COPY . /app

## Release Stage

FROM node:14-alpine
WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /app /server

WORKDIR /server

RUN npm run db:migrate

# Actually run the service
EXPOSE 1234/tcp
CMD [ "npm", "start" ]