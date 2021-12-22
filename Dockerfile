FROM node:12.18.3 AS builder

WORKDIR /usr/src/finance-ui

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build-prod

FROM nginx:1.17-alpine

COPY --from=builder /usr/src/finance-ui/dist/finance-ui /usr/share/nginx/html

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
