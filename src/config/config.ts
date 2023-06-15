import { RabbitHostConfig, SqlConfig, EntityConfig, Config } from 'homelinkstash-plugin-sdk';
import { EntitySettings, getSettings } from './settings';

const isDocker = process.env.IS_DOCKER === 'true';
const settings = getSettings();

function buildEntityConfig(entity: string): EntityConfig {
    try {
        const landlordReference = settings.landlordReference.toLowerCase();
        const entityName = entity;
        const entitySettings: EntitySettings = settings.entities[entityName];
        const entityConfig: EntityConfig = {
            consume: {
                deadLetterExchange: `${settings.landlordReference}.${entity}.deadletter`,
                queue: `${landlordReference}.${entity}`,
                failedRoutingKey: '#',
                maxRetry: 1,
                prefetch: 100,
                enabled: entitySettings.enabled
            },
            actionType: entitySettings.action,
            sns: entitySettings.sns,
            hook: {
                endpoint: entitySettings.webhook.endpoint,
                authenticationMethod: entitySettings.webhook.authenticationMethod,
                method: entitySettings.webhook.method,
                username: entitySettings.webhook.username,
                password: entitySettings.webhook.password,
                successCodes: entitySettings.webhook.successCodes.split(',').map(x => Number(x.trim()))
            },
            usesDb: entitySettings.action === 'database',
            usesSns: entitySettings.action === 'sns',
            usesHook: entitySettings.action === 'webhook',
        };

        return entityConfig;
    } catch (err) {
        console.error(`Error processing config for ${entity}`, err);
        throw err;
    }
}

const sqlConfig: SqlConfig = {
    dialect: settings.database.dialect,
    host: settings.database.host,
    database: settings.database.database,
    user: settings.database.user,
    password: settings.database.password,
    port: settings.database.port,
    timezone: settings.database.timezone
};

const rabbitHostConfig: RabbitHostConfig = {
    host: settings.system.broker.host,
    port: settings.system.broker.port,
    vhost: settings.landlordReference,
    tls: false,
    username: settings.landlordReference,
    password: settings.password,
    publishTimeoutMs: 5000
};

const baseConfiguration: Config = {
    environment: process.env.NODE_ENV || 'local',
    isDocker: isDocker,
    device: buildEntityConfig('device'),
    alert: buildEntityConfig('alert'),
    reading: buildEntityConfig('reading'),
    notification: buildEntityConfig('notification'),
    property: buildEntityConfig('property'),
    rabbitHost: rabbitHostConfig,
    enableDb: false,
    logging: {
        loglevel: settings.logging.level,
        human: settings.logging.human
    },
    sqlConfig: sqlConfig,
    plugins: settings.plugins
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
