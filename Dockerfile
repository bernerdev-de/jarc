FROM node:15-alpine

WORKDIR /app
COPY . .

ENV NODE_ENV=development
RUN npm install
RUN npm run build

ENV NODE_ENV=production
RUN rm -r node_modules
RUN npm install
RUN rm -r src tsconfig* nest-cli.json

CMD [ "node", "dist/main.js" ]