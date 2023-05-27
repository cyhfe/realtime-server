FROM node:18-alpine
ENV PORT=4000
ENV DATABASE_URL="file:./dev.db"
ENV JWT_SECRET=123
ENV ADMIN_SECRET=1234
WORKDIR /app

COPY package.json package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
EXPOSE 4000
