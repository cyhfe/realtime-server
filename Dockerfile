FROM node:18-alpine

WORKDIR /app

RUN npm i pnpm -g

COPY ["package.json", "package-lock.json*", "./"]

RUN pnpm install

ADD . .


RUN npx prisma generate

COPY tsconfig.json ./

RUN tsc 

CMD ["node", "dist/server.js"]