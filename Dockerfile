FROM node:18-alpine

WORKDIR /app

COPY package.json package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
EXPOSE 4001
