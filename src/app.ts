
import { TYPES } from './global/types';
import { configuration } from './config/config';
import { Logger } from './utility/logger';
import { DependencyInjectionContainer } from './container';
import { ConsumerBase } from './consumerBase';
import { SqlDbConnection } from './forward/db/SqlDbConnection';
import { PropertyTable } from './forward/db/migrations/CreatePropertyTable';
import { ReadingTable } from './forward/db/migrations/CreateReadingTable';

let deviceConsumer: ConsumerBase;
let alertConsumer: ConsumerBase;
let notificationConsumer: ConsumerBase;
let propertyConsumer: ConsumerBase;
let readingConsumer: ConsumerBase;

export async function ensureSchema(): Promise<void> {

    if (!configuration.enableDb) {
        return;
    }

    Logger.info('Initialising database schema');
    const dbConnection = DependencyInjectionContainer.get<SqlDbConnection>(TYPES.SqlDbConnection);
    const deviceTable = new PropertyTable(dbConnection);
    const readingTable = new ReadingTable(dbConnection);
    await deviceTable.create();
    await readingTable.create();
    Logger.info('Database schema initialised.');
}

export async function startAllConsumers(): Promise<boolean> {
    logStartup();

    if (configuration.device.consume.enabled) {
        Logger.info('Starting device consumer');
        deviceConsumer = DependencyInjectionContainer.get<ConsumerBase>(TYPES.DeviceConsumer);
        Logger.info('Now consuming devices');
    } else {
        Logger.warn('Device consume is not enabled');
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
    Logger.warn('Using timezone: ' + tz);
    Logger.warn('Using configuration for environment: ' + configuration.environment);
    Logger.warn('Process Id (PID): ' + process.pid);
}