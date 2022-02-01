# alpine ~310Mb, bullseye-slim ~384Mb choose what you prefer
# FROM node:17-bullseye-slim
FROM node:17-alpine3.14

WORKDIR /home/node/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5000

USER node

CMD [ "node", "/home/node/app/build/server.js" ]