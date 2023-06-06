import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'inversify';
import { TYPES } from '../global/types';
import { SqlDbConnection } from '../forward/db/sqlDbConnection';
import { ServiceClient } from './serviceClient';
import { ISnsClient } from '../forward/sns/snsClient';
import { configuration } from '../config/config';
import { Logger } from '../utility/logger';
import { MqttNotification } from '../model/reading';

@injectable()
export class NotificationClient implements ServiceClient {

    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection, @inject(TYPES.NotificationSnsClient) private snsClient: ISnsClient) {
    }

    public async create(msg: ConsumeMessage, payload: MqttNotification) {

        if (configuration.notification.usesDb) {
            Logger.debug(`Persisting to database ${configuration.store.database}`);
            await this.dbConnection.builder(`${configuration.store.database}.notificationMessage`).insert(payload);
        }

        if (configuration.notification.usesSns) {
            if (!configuration.notification.sns.topic) {
                throw new Error('Notification sns topic not configured add environment variable SNS_NOTIFICATION_TOPIC');
            }
            this.snsClient.publish(configuration.notification.sns.topic, payload);
        }
    }
}