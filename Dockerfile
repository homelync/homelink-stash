# Build Layer
FROM node:16.18.0-alpine as build
RUN apk add --update --no-cache \
    python3 \
    make \
    g++

COPY . /src
WORKDIR /src

RUN npm ci

RUN npm run build
RUN npm prune --production

#Second Layer

FROM node:16.18.0-alpine
RUN apk add --update --no-cache curl

EXPOSE 3000

WORKDIR /stash

COPY --from=build /src/node_modules node_modules
COPY --from=build /src/dist /stash

HEALTHCHECK --interval=5s \
            --timeout=5s \
            --retries=6 \
            CMD curl -fs http://localhost:3000/ || exit 1

USER node

ENV TZ UTC
ENV IS_DOCKER true

CMD ["node", "./index.js"]
