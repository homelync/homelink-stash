# Homelink-Sink

Message consumer for homelink.

## Step 1
Specify config your config:

- local: [.env.local](./src/env/.env.local)
- test: [.env.test](./src/env/.env.test)
- production: [.env.production](./src/env/.env.production)

## Build and Run Container

- $ `npm run docker:build`
- $ `docker-compose -f docker-compose-local.yml`

OR
- $ `docker-compose -f docker-compose-test.yml`

OR
- $ `docker-compose -f docker-compose-production.yml`

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