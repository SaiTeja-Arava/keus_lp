FROM node:18

WORKDIR /app/frontend

COPY package.json package-lock.json ./

RUN npm i

COPY . .

EXPOSE 5000