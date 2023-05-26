FROM node:18-alpine 

ARG NODE_ENV=production

WORKDIR /code

EXPOSE 4000

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

RUN npm install

ADD prisma /code/prisma

ENV DATABASE_URL="file:./dev.db"

RUN npx prisma migrate deploy 
RUN npx prisma generate

COPY . .

RUN npm run build

RUN npm start
 