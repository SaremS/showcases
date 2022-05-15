FROM node:16.14.2-alpine as build

ENV PATH /app/node_modules/.bin:$PATH
COPY ./src/ ./showcases/src/
COPY ./public/ ./showcases/public
COPY ./package.json ./showcases/package.json
COPY ./package-lock.json ./showcases/package-lock.json
COPY ./env ./showcases/.env

ENV NODE_ENV=PROD

WORKDIR /showcases

RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent


EXPOSE 3000

CMD ["npm", "run", "start"]
