import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'inversify';
import { TYPES } from '../global/types';
import { SqlDbConnection } from '../forward/db/sqlDbConnection';
import { ServiceClient } from './serviceClient';
import { ISnsClient } from '../forward/sns/snsClient';
import { configuration } from '../config/config';
import { Logger } from '../utility/logger';
import { prepareForInsert } from '../utility/message-utils';
import { ExternalAlertPayload } from '../model/package/messaging/external/payloads/alert';

@injectable()
export class AlertClient implements ServiceClient {

    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection, @inject(TYPES.DeviceSnsClient) private snsClient: ISnsClient) {
    }

    public async create(msg: ConsumeMessage, payload: ExternalAlertPayload) {

        if (configuration.alert.usesDb) {
            Logger.debug(`Persisting to database ${configuration.store.database}`);
            const record = prepareForInsert(payload);

            const sql = this.dbConnection.builder(`${configuration.store.database}.alertMessage`).insert(record).toString();
            await this.dbConnection.executeRaw(`${sql} ON DUPLICATE KEY UPDATE __IDENTITY = __IDENTITY;`);
        }

        if (configuration.alert.usesSns) {
            if (!configuration.alert.sns.topic) {
                throw new Error('Alert sns topic not configured add environment variable SNS_ALET_TOPIC');
            }
            this.snsClient.publish(configuration.alert.sns.topic, payload);
        }
    }
}