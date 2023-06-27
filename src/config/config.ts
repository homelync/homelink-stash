import { RabbitHostConfig, SqlConfig, EntityConfig, Config, SqlDialect, AuthenticationType, EntitySettings } from 'homelink-stash-sdk';
import { getSettings } from './settings';

const isDocker = process.env.IS_DOCKER === 'true';
const settings = getSettings();

function buildEntitySettingsFromEnv(entity: string): EntitySettings | null {
    const entityName = entity.toUpperCase();
    const entityKey = `ENTITY_${entityName}`;
    const entityEnabled = process.env[`${entityKey}_ENABLED`];
    const entityHasEnvConfig = entityEnabled === 'false' || entityEnabled === 'true';
    if (!entityHasEnvConfig) {
        return null;
    }
    return {
        enabled: entityEnabled === 'true',
        action: process.env[`${entityKey}_ACTION`]!,
        sns: {
            topic: process.env[`${entityKey}_SNS_TOPIC`]!,
            clientId: process.env[`${entityKey}_SNS_CLIENTID`]!,
            secret: process.env[`${entityKey}_SNS_SECRET`]!
        },
        webhook: {
            endpoint: process.env[`${entityKey}_WEBHOOK_ENDPOINT`]!,
            authenticationMethod: process.env[`${entityKey}_WEBHOOK_AUTHENTICATION_METHOD`]! as AuthenticationType,
            successCodes: process.env[`${entityKey}_WEBHOOK_SUCCESS_CODES`] || '200',
            method: process.env[`${entityKey}_WEBHOOK_METHOD`]!,
            username: process.env[`${entityKey}_WEBHOOK_USERNAME`]!,
            password: process.env[`${entityKey}_WEBHOOK_PASSWORD`]!
        }
    };
}

function buildEntityConfig(entity: string): EntityConfig {
    try {
        const landlordReference = process.env.CONDUIT_VHOST || settings.landlordReference.toLowerCase();
        const entityName = entity;
        const environmentEntitySettings = buildEntitySettingsFromEnv(entity);
        const entitySettings: EntitySettings = environmentEntitySettings || settings.entities[entityName];
        const entityConfig: EntityConfig = {
            consume: {
                deadLetterExchange: `${landlordReference}.${entity}.deadletter`,
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
    dialect: process.env.ACTION_DB_DIALACT as SqlDialect || settings.database.dialect,
    host: process.env.ACTION_DB_HOST || settings.database.host,
    database: process.env.ACTION_DB_DATABASE || settings.database.database,
    user: process.env.ACTION_DB_USER || settings.database.user,
    password: process.env.ACTION_DB_PASSWORD || settings.database.password,
    port: process.env.ACTION_DB_PORT ? Number(process.env.ACTION_DB_PORT) : settings.database.port,
    timezone: process.env.ACTION_DB_TIMEZONE || settings.database.timezone
};

const rabbitHostConfig: RabbitHostConfig = {
    host: process.env.CONDUIT_HOST || settings.system.broker.host,
    port: process.env.CONDUIT_PORT ? Number(process.env.CONDUIT_PORT) : settings.system.broker.port,
    vhost: process.env.CONDUIT_VHOST || settings.landlordReference,
    tls: process.env.CONDUIT_INSECURE === 'true' ? false : true,
    username: process.env.CONDUIT_USER || settings.landlordReference,
    password: process.env.CONDUIT_PASSWORD || settings.password,
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
        loglevel: process.env.LOG_LEVEL || settings.logging.level,
        human: process.env.LOG_HUMAN === 'true' ? true : settings.logging.human,
        suppressRemote: process.env.CONDUIT_SUPPRESS_REMOTE === 'true' ? true : settings.logging.suppressRemote
    },
    sqlConfig: sqlConfig,
    httpTimeout: process.env.CONDUIT_HTTP_TIMEOUT ? Number(process.env.CONDUIT_HTTP_TIMEOUT) : Number(settings.httpTimeout),
    plugins: settings.plugins
};

baseConfiguration.enableDb = baseConfiguration.alert.usesDb
    || baseConfiguration.device.usesDb
    || baseConfiguration.notification.usesDb
    || baseConfiguration.property.usesDb
    || baseConfiguration.reading.usesDb;

export const configuration = baseConfiguration;

export async function loadConfig(): Promise<Config> {
    return baseConfiguration;
}
