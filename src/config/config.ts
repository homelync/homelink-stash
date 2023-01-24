import { resolve as pathResolve } from 'path';
import { config } from 'dotenv';
import { RabbitConsumeConfig, RabbitHostConfig } from './rabbitConfig';
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

const deviceRabbitConfig: RabbitConsumeConfig = {
    deadLetterExchange: `${env.LANDLORD_REFERENCE!.toLowerCase()}.device-deadletter`,
    queue: `${env.LANDLORD_REFERENCE!.toLowerCase()}.device`,
    failedRoutingKey: '#',
    maxRetry: 1,
    enabled: !!(env.DEVICE_ENABLED && env.DEVICE_ENABLED.toLowerCase() === 'true')
}

const alertRabbitConfig: RabbitConsumeConfig = {
    deadLetterExchange: `${env.LANDLORD_REFERENCE!.toLowerCase()}.alert-deadletter`,
    queue: `${env.LANDLORD_REFERENCE!.toLowerCase()}.alert`,
    failedRoutingKey: '#',
    maxRetry: 1,
    enabled: env.ALERT_ENABLED!.toLowerCase() === 'true'
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
    deviceConsume: deviceRabbitConfig,
    alertConsume: alertRabbitConfig,
    rabbitHost: rabbitHostConfig,
    deviceActionType: env.DEVICE_ACTION,
    alertActionType: env.ALERT_ACTION,
    sns: {
        device: {
            clientId: env.SNS_DEVICE_CLIENTID,
            clientSecret: env.SNS_DEVICE_CLIENTSECRET,
            topic: env.SNS_DEVICE_TOPIC
        },
        alert: {
            clientId: env.SNS_ALERT_CLIENTID,
            clientSecret: env.SNS_ALERT_CLIENTSECRET,
            topic: env.SNS_ALERT_TOPIC
        }
    },
    logging: {
        loglevel: env.LOG_LEVEL,
        human: env.LOGGING_HUMAN === 'true'
    },
    store: sqlConfig
};

export const configuration = baseConfiguration;

console.log(JSON.stringify(configuration, null, 4));
