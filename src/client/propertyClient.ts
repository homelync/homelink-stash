import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'inversify';
import { TYPES } from '../global/types';
import { SqlDbConnection } from '../forward/db/sqlDbConnection';
import { ServiceClient } from './serviceClient';
import { ISnsClient } from '../forward/sns/snsClient';
import { configuration } from '../config/config';
import { Logger } from '../utility/logger';
import { ExternalPropertyPayload } from '../model/package/messaging/external/payloads/property';
import fetch from 'node-fetch';
import { prepareForInsert } from '../utility/message-utils';

@injectable()
export class PropertyClient implements ServiceClient {

    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection, @inject(TYPES.PropertySnsClient) private snsClient: ISnsClient) {
    }

    public async create(msg: ConsumeMessage, payload: ExternalPropertyPayload) {

        if (configuration.property.usesDb) {
            Logger.debug(`Persisting to database ${configuration.store.database}`);
            const record = prepareForInsert(payload);
            const sql = this.dbConnection.builder(`${configuration.store.database}.propertyMessage`).insert(record).toString();
            await this.dbConnection.executeRaw(`${sql} ON DUPLICATE KEY UPDATE __IDENTITY = __IDENTITY;`)
        }

        if (configuration.property.usesSns) {
            if (!configuration.property.sns.topic) {
                throw new Error('Property sns topic not configured add environment variable SNS_PROPERTY_TOPIC');
            }
            this.snsClient.publish(configuration.property.sns.topic, payload);
        }

        if (configuration.property.usesHook) {
            if (!configuration.property.hook.url) {
                throw new Error('Property hook url not configured add environment variable PROPERTY_HOOK_URL');
            }

            const response = await fetch(configuration.property.hook.url, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) {
                throw new Error(`Property hook failed with status code ${response.status}`);
            }
        }
    }
}