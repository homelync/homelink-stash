import { resolve as pathResolve } from 'path';
import { config } from 'dotenv';
import { EntityConfig, RabbitHostConfig } from './rabbitConfig';
import { SqlConfig, SqlDialect } from './sqlConfig';

const env = process.env;
const nodeEnv = env.NODE_ENV || 'local';
if (process.env.IS_DOCKER === 'true') {
    config({ path: pathResolve(__dirname, `/etc/homelink-stash/env/.env.${nodeEnv}`) });
} else {
    config({ path: pathResolve(__dirname, `../env/.env.${nodeEnv}`) });
}

function buildEntityConfig(entity: string): EntityConfig {
    try {

        return {
            consume: {
                deadLetterExchange: `${env.LANDLORD_REFERENCE!.toLowerCase()}.${entity}.deadletter`,
                queue: `${env.LANDLORD_REFERENCE!.toLowerCase()}.${entity}`,
                failedRoutingKey: '#',
                maxRetry: 1,
                prefetch: 100,
                enabled: env[`${entity.toUpperCase()}_ENABLED`]!.toLowerCase() === 'true'
            },
            actionType: env[`${entity.toUpperCase()}_ACTION`],
            sns: {
                clientId: env[`SNS_${entity.toUpperCase()}_CLIENTID`]!,
                clientSecret: env[`SNS_${entity.toUpperCase()}_CCLIENTSECRET`]!,
                topic: env[`SNS_${entity.toUpperCase()}_TOPIC`]!
            },
            hook: {
                url: env[`HOOK_${entity.toUpperCase()}_URL`]!,
            },
            usesDb: !!env[`${entity.toUpperCase()}_ACTION`]?.toLowerCase()?.includes('database'),
            usesSns: !!env[`${entity.toUpperCase()}_ACTION`]?.toLowerCase()?.includes('sns'),
            usesHook: !!env[`${entity.toUpperCase()}_ACTION`]?.toLowerCase()?.includes('hook')
        };
    } catch (err) {
        console.error(`Error processing config for ${entity}`, err);
        throw err;
    }
}

const sqlConfig: SqlConfig = {
    dialect: env.SQL_DIALECT as SqlDialect,
    host: env.SQL_HOST!,
    database: env.SQL_DATABASE!,
    user: env.SQL_USERNAME!,
    password: env.SQL_PASSWORD!,
    port: parseInt(env.SQL_PORT!, 10),
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
};

const baseConfiguration = {
    environment: nodeEnv,
    device: buildEntityConfig('device'),
    alert: buildEntityConfig('alert'),
    reading: buildEntityConfig('reading'),
    notification: buildEntityConfig('notification'),
    property: buildEntityConfig('property'),
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

export async function loadConfig() {
    // Dummy method to load this module as part of the promise chain startup.
}
