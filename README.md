# homelink-stash

You know, for stashing stuff.....think, "[Logstash](https://www.elastic.co/logstash/) for HomeLINK"



## Step 1
Specify config your config by copying the examples template from  [./src/envTemplate](./src/envTemplate) to [./src/env](./src/env) and poplulating with your details/settings:

- local: [.env.local](./src/envTemplate/.env.local)
- test: [.env.test](./src/envTemplate/.env.test)
- production: [.env.production](./src/envTemplate/.env.production)

## Build and Run Container

### Linux

```
      $ npm run docker:build
      $ docker run -d --network host \
        --name homelink-stash \
        --restart unless-stopped \
        --log-opt max-size=10m \
        --log-opt max-file=5 \
        -v "$(pwd)/settings.json:/stash/settings.json" \
        homelinkstash:latest
```
### Windows

Must be powershell

```
      PS>  npm run docker:build
      PS>  docker run -d -h localhost `
           --name homelink-stash `
           --restart unless-stopped	`
           --log-opt max-size=10m `
           --log-opt max-file=5 `
           -v ${pwd}/settings.json:/stash/settings.json `
           homelinkstash:latest
```

## Database setup

Database will be setup automatically if configured to do so.