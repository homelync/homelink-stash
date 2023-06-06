import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'inversify';
import { TYPES } from '../global/types';
import { SqlDbConnection } from '../forward/db/sqlDbConnection';
import { ServiceClient } from './serviceClient';
import { ISnsClient } from '../forward/sns/snsClient';
import { configuration } from '../config/config';
import { Logger } from '../utility/logger';
import { MqttNotification } from '../model/reading';
import { prepareForInsert } from '../utility/message-utils';
import { ExternalNotificationPayload } from '../model/package/messaging/external/payloads/notification';

@injectable()
export class NotificationClient implements ServiceClient {

    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection, @inject(TYPES.NotificationSnsClient) private snsClient: ISnsClient) {
    }

    public async create(msg: ConsumeMessage, payload: ExternalNotificationPayload) {

        if (configuration.notification.usesDb) {
            Logger.debug(`Persisting to database ${configuration.store.database}`);
            const record = prepareForInsert(payload);
            await this.dbConnection.knexRaw().transaction(async (trx) => {
                for (const a of record.alerts) {
                    const alertRecord = prepareForInsert(a);
                    alertRecord.notificationId = record.notificationId;
                    const sql = this.dbConnection.builder(`${configuration.store.database}.notificationAlertMessage`).insert(alertRecord).toString();
                    await this.dbConnection.executeRaw(`${sql} ON DUPLICATE KEY UPDATE __IDENTITY = __IDENTITY;`, trx);
                }
                delete (record as any).alerts;
                const sql = this.dbConnection.builder(`${configuration.store.database}.notificationMessage`).insert(record).toString();
                await this.dbConnection.executeRaw(`${sql} ON DUPLICATE KEY UPDATE __IDENTITY = __IDENTITY;`, trx);
            });

        }

        if (configuration.notification.usesSns) {
            if (!configuration.notification.sns.topic) {
                throw new Error('Notification sns topic not configured add environment variable SNS_NOTIFICATION_TOPIC');
            }
            this.snsClient.publish(configuration.notification.sns.topic, payload);
        }
    }
}