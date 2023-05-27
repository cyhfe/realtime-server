FROM node:18-alpine

WORKDIR /app

ENV PORT=${PORT}
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV ADMIN_SECRET=${ADMIN_SECRET}

COPY package.json package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
EXPOSE 4001
