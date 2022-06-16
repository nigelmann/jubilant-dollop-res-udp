FROM node:18.3-alpine

COPY ./ /app

WORKDIR /app/

RUN npm install

ENTRYPOINT [ "node", "/app/src/index.js" ]

