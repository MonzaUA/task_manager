FROM node:20

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "npm run build && npx knex migrate:latest --knexfile knexfile.cjs && node dist/app.js"]
