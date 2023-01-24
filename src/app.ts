
import { TYPES } from './global/types';
import { configuration } from './config/config';
import { Logger } from './utility/logger';
import { DependencyInjectionContainer } from './container';
import { ConsumerBase } from './consumerBase';
import { SqlDbConnection } from './forward/db/SqlDbConnection';
import { DeviceTable } from './forward/db/migrations/CreateDeviceTable';

let deviceConsumer: ConsumerBase;
let alertConsumer: ConsumerBase;

export async function ensureSchema(): Promise<void> {
    Logger.info('Initialising database schema');
    const dbConnection = DependencyInjectionContainer.get<SqlDbConnection>(TYPES.SqlDbConnection);
    const deviceTable = new DeviceTable(dbConnection);
    await deviceTable.create();
    Logger.info('Database schema initialised.');
}

export async function startAllConsumers(): Promise<boolean> {
    logStartup();

    if (configuration.deviceConsume.enabled) {
        Logger.info('Starting device consumer');
        deviceConsumer = DependencyInjectionContainer.get<ConsumerBase>(TYPES.DeviceConsumer);
        Logger.info('Now consuming devices');
    } else {
        Logger.warn('Device consume is not enabled');
    }

    if (configuration.alertConsume.enabled) {
        Logger.info('Starting alert consumer');
        alertConsumer = DependencyInjectionContainer.get<ConsumerBase>(TYPES.AlertConsumer);
        Logger.info('Now consuming alerts');
    } else {
        Logger.warn('Alert consumer is not enabled');
    }

    return true;
}

export async function stop() {
    if (deviceConsumer) deviceConsumer.close();
    if (alertConsumer) alertConsumer.close();
}

function logStartup() {
    const tz = process.env.TZ;
    if (tz !== 'UTC') {
        throw Error(`Server must run as TZ = UTC but was ${tz}, check your TZ environment variable`);
    }
    Logger.warn('Using timezone: ' + tz);
    Logger.warn('Using configuration for environment: ' + configuration.environment);
    Logger.warn('Process Id (PID): ' + process.pid)
}