import { resolve as pathResolve } from 'path';
import { config } from 'dotenv';
import { EntityConfig, RabbitConsumeConfig, RabbitHostConfig } from './rabbitConfig';
import { SqlConfig, SqlDialect } from './sqlConfig';
import { Logger } from '../utility/logger';

const env = process.env;
const nodeEnv = env.NODE_ENV || 'local';
if (process.env.IS_DOCKER === 'true') {
    config({ path: pathResolve(__dirname, `/etc/homelink-sink/env/.env.${nodeEnv}`) });
} else {
    config({ path: pathResolve(__dirname, `../env/.env.${nodeEnv}`) });
}

console.log(`Environment: NODE_ENV=${nodeEnv}`);

let eiPrefixClients = '';

export function setEiPrefixClient(clientCode: string) {
    eiPrefixClients = clientCode;
}

function buildEntityConfig(entity: string): EntityConfig {
    return {
        consume: {
            deadLetterExchange: `${env.LANDLORD_REFERENCE!.toLowerCase()}.${entity}-deadletter`,
            queue: `${env.LANDLORD_REFERENCE!.toLowerCase()}.${entity}`,
            failedRoutingKey: '#',
            maxRetry: 1,
            enabled: env[`${entity.toUpperCase()}_ENABLED`]!.toLowerCase() === 'true'
        },
        actionType: env[`${entity.toUpperCase()}_ACTION`],
        sns: {
            clientId: env[`SNS_${entity.toUpperCase()}_CLIENTID`]!,
            clientSecret: env[`SNS_${entity.toUpperCase()}_CCLIENTSECRET`]!,
            topic: env[`SNS_${entity.toUpperCase()}_TOPIC`]!
        },
        usesDb: !!env[`${entity.toUpperCase()}_ACTION`]?.toLowerCase()?.includes('database'),
        usesSns: !!env[`${entity.toUpperCase()}_ACTION`]?.toLowerCase()?.includes('sns')
    }
}

const sqlConfig: SqlConfig = {
    dialect: env.SQL_DIALECT as SqlDialect,
    host: env.SQL_HOST!,
    database: env.SQL_DATABASE!,
    user: env.SQL_USERNAME!,
    password: env.SQL_PASSWORD!,
    port: parseInt(env.SQL_PORT!),
    timezone: env.SQL_TIMEZONE || '+00:00'
};

const rabbitHostConfig: RabbitHostConfig = {
    host: env.RABBIT_HOST,
    port: Number(env.RABBIT_PORT),
    vhost: env.RABBIT_VIRTUAL_HOST,
    tls: env.RABBIT_TLS === 'true',
    username: env.RABBIT_USERNAME,
    password: env.RABBIT_PASSWORD,
    publishTimeoutMs: 5000
}

const baseConfiguration = {
    environment: nodeEnv,
    device: buildEntityConfig('device'),
    alert: buildEntityConfig('alert'),
    reading: buildEntityConfig('reading'),
    notification: buildEntityConfig('notification'),
    property: buildEntityConfig('propery'),
    rabbitHost: rabbitHostConfig,
    enableDb: false,
    logging: {
        loglevel: env.LOG_LEVEL,
        human: env.LOGGING_HUMAN === 'true'
    },
    store: sqlConfig
};

baseConfiguration.enableDb = baseConfiguration.alert.usesDb
    || baseConfiguration.device.usesDb
    || baseConfiguration.notification.usesDb
    || baseConfiguration.property.usesDb
    || baseConfiguration.reading.usesDb;

export const configuration = baseConfiguration;

console.log(JSON.stringify(configuration, null, 4));
