
import { TYPES } from './global/types';
import { configuration } from './config/config';
import { Logger } from './utility/logger';
import { DependencyInjectionContainer } from './container';
import { ConsumerBase } from './consumerBase';
import { runMigrations } from './actions/database/migrator';

let deviceConsumer: ConsumerBase;
let alertConsumer: ConsumerBase;
let notificationConsumer: ConsumerBase;
let propertyConsumer: ConsumerBase;
let readingConsumer: ConsumerBase;

export async function ensureSchema(): Promise<void> {

    try {
        if (!configuration.enableDb) {
            return;
        }

        Logger.info('Initialising database schema');
        await runMigrations();
        Logger.info('Database schema initialised.');
    } catch (err) {
        Logger.error('Error ensuring database schema', err);
        throw err;
    }
}

export async function initialisePlugins(): Promise<void> {
    try {
        for (const p of configuration.plugins) {
            try {
                Logger.info(`Registering plugin ${p.name}`);
                const Registration = require(`./plugins/${p.name}/registration`);
                const plugin = new Registration(DependencyInjectionContainer, configuration, TYPES);
                await plugin.init();
                Logger.info(`Plugin ${p.name} successfully registered`);
            } catch (err) {
                Logger.error(`Error initialising plugin ${p.name}`, err);
            }
        }
    } catch (err) {
        Logger.error('Error initialising plugins', err);
        throw err;
    }
}

export async function startAllConsumers(): Promise<boolean> {
    try {
        logStartup();

        if (configuration.device.consume.enabled) {
            Logger.info('Starting device consumer');
            deviceConsumer = DependencyInjectionContainer.get<ConsumerBase>(TYPES.DeviceConsumer);
            Logger.info('Now consuming devices');
        } else {
            Logger.warn('Device consumer is not enabled');
        }

        if (configuration.alert.consume.enabled) {
            Logger.info('Starting alert consumer');
            alertConsumer = DependencyInjectionContainer.get<ConsumerBase>(TYPES.AlertConsumer);
            Logger.info('Now consuming alerts');
        } else {
            Logger.warn('Alert consumer is not enabled');
        }

        if (configuration.reading.consume.enabled) {
            Logger.info('Starting reading consumer');
            readingConsumer = DependencyInjectionContainer.get<ConsumerBase>(TYPES.ReadingConsumer);
            Logger.info('Now consuming readings');
        } else {
            Logger.warn('Reading consumer is not enabled');
        }

        if (configuration.notification.consume.enabled) {
            Logger.info('Starting notification consumer');
            notificationConsumer = DependencyInjectionContainer.get<ConsumerBase>(TYPES.NotificationConsumer);
            Logger.info('Now consuming notifications');
        } else {
            Logger.warn('Notification consumer is not enabled');
        }

        if (configuration.property.consume.enabled) {
            Logger.info('Starting property consumer');
            propertyConsumer = DependencyInjectionContainer.get<ConsumerBase>(TYPES.PropertyConsumer);
            Logger.info('Now consuming propertys');
        } else {
            Logger.warn('Property consumer is not enabled');
        }

        return true;
    } catch (err) {
        Logger.error('Error starting consumer', err);
        throw err;
    }
}

export async function stop() {
    if (deviceConsumer) deviceConsumer.close();
    if (alertConsumer) alertConsumer.close();
    if (propertyConsumer) propertyConsumer.close();
    if (readingConsumer) readingConsumer.close();
    if (notificationConsumer) notificationConsumer.close();
}

function logStartup() {
    const tz = process.env.TZ;
    if (tz !== 'UTC') {
        throw Error(`Server must run as TZ = UTC but was ${tz}, check your TZ environment variable`);
    }
    Logger.info('Using timezone: ' + tz);
    Logger.info('Using configuration for environment: ' + configuration.environment);
}