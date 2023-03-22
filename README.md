# homelink-stash

You know, for stashing stuff.....think, "[Logstash](https://www.elastic.co/logstash/) for HomeLINK"



## Step 1
Specify config your config by copying the examples template from  [./src/envTemplate](./src/envTemplate) to [./src/env](./src/env) and poplulating with your details/settings:

- local: [.env.local](./src/envTemplate/.env.local)
- test: [.env.test](./src/envTemplate/.env.test)
- production: [.env.production](./src/envTemplate/.env.production)

## Build and Run Container

- $ `npm run docker:build`
- $ `docker-compose -f docker-compose-local.yml`

OR
- $ `docker-compose -f docker-compose-test.yml`

OR
- $ `docker-compose -f docker-compose-production.yml`

###

```
- Docker run command on windows (use powershell and execute from root of this repo):

      docker run -d -h localhost  \
           --name homelink-stash    \
           --restart unless-stopped	 \
           -e "NODE_ENV=local"   \
           -v ${pwd}/src/env:/etc/homelink-stash/env \
           homelinksink:latest

```

## Database setup

### MS Sql Server
```

USE master
GO

CREATE DATABASE Homelink;
GO

USE Homelink;
GO

CREATE LOGIN Homelink WITH PASSWORD=N'MyPassword', DEFAULT_DATABASE = Homelink
GO

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE [name] = 'Homelink') EXEC ('CREATE SCHEMA [HomeLink]')
GO

CREATE USER Homelink FOR LOGIN Homelink WITH DEFAULT_SCHEMA = [Homelink]
GO

ALTER AUTHORIZATION ON SCHEMA::[Homelink] TO [Homelink]
GO

GRANT CREATE TABLE TO [Homelink]
GO


```