FROM node:18-alpine

WORKDIR /

COPY ./server/package.json package.json ./

RUN npm install --prefer-dedupe

COPY ./server .

EXPOSE 3000

CMD [ "node","server.js" ]