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
export class AlertClient implements ServiceClient {

    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection, @inject(TYPES.DeviceSnsClient) private snsClient: ISnsClient) {
    }

    public async create(msg: ConsumeMessage, payload: MqttDevice) {

        if (configuration.alert.usesDb) {
            Logger.debug(`Persisting to database ${configuration.store.database}`);
            await this.dbConnection.builder(`${configuration.store.database}.alertMessage`).insert(payload);
        }

        if (configuration.alert.usesSns) {
            if (!configuration.alert.sns.topic) {
                throw new Error('Alert sns topic not configured add environment variable SNS_ALET_TOPIC');
            }
            this.snsClient.publish(configuration.alert.sns.topic, payload);
        }
    }
}