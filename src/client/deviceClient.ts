import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'inversify';
import { TYPES } from '../global/types';
import { MqttDevice } from '../model/device';
import { SqlDbConnection } from '../forward/db/SqlDbConnection';
import { ServiceClient } from './serviceClient';
import { ISnsClient } from '../forward/sns/snsClient';
import { configuration } from '../config/config';
import { Logger } from '../utility/logger';

@injectable()
export class DeviceClient implements ServiceClient {

    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection, @inject(TYPES.DeviceSnsClient) private snsClient: ISnsClient) {
    }

    public async create(msg: ConsumeMessage, payload: MqttDevice) {

        if (configuration.device.usesDb) {
            Logger.debug(`Persisting to database ${configuration.store.database}`);
            await this.dbConnection.builder(`${configuration.store.database}.deviceMessage`).insert(payload);
        }

        if (configuration.device.usesSns) {
            if (!configuration.device.sns.topic) {
                throw new Error('Device sns topic not configured add environment variable SNS_DEVICE_TOPIC');
            }
            this.snsClient.publish(configuration.device.sns.topic, payload);
        }
    }
}