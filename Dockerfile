FROM node:18-alpine

WORKDIR /app

RUN npm install pm2 -g

COPY package.json package*.json ./
RUN npm install

COPY prisma .
COPY .env .
RUN npx prisma migrate deploy
RUN npx prisma generate
COPY . .
RUN npm run build
CMD ["pm2-runtime", "dist/index.js"]
EXPOSE 4000
