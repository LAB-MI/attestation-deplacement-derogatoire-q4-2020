FROM node:lts-buster

WORKDIR /usr/src/app

RUN chown node:node .

USER node

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "start" ]
