# Build Layer
FROM node:16.8-alpine3.13 as build
RUN apk add --update --no-cache \
    python3 \
    make \
    g++

COPY . /src
WORKDIR /src

RUN npm ci

RUN npm run build
#RUN npm run test:unit

RUN npm prune --production

#Second Layer

FROM node:16.8-alpine3.13
RUN apk add --update --no-cache curl

EXPOSE 3000

WORKDIR /usr/src/service

COPY --from=build /src/node_modules node_modules
COPY --from=build /src/dist dist

HEALTHCHECK --interval=5s \
            --timeout=5s \
            --retries=6 \
            CMD curl -fs http://localhost:3000/ || exit 1

USER node

ENV TZ UTC
ENV IS_DOCKER true

CMD ["node", "./dist/index.js"]
