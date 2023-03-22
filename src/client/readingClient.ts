import { ConsumeMessage } from 'amqplib';
import { inject, injectable } from 'inversify';
import { TYPES } from '../global/types';
import { SqlDbConnection } from '../forward/db/SqlDbConnection';
import { ServiceClient } from './serviceClient';
import { ISnsClient } from '../forward/sns/snsClient';
import { configuration } from '../config/config';
import { Logger } from '../utility/logger';
import { MqttReading } from '../model/reading';

@injectable()
export class ReadingClient implements ServiceClient {

    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection, @inject(TYPES.ReadingSnsClient) private snsClient: ISnsClient) {
    }

    public async create(msg: ConsumeMessage, payload: MqttReading) {

        if (configuration.reading.usesDb) {
            Logger.debug(`Persisting to database ${configuration.store.database}`);
            await this.dbConnection.builder(`${configuration.store.database}.readingMessage`).insert(payload);
        }

        if (configuration.reading.usesSns) {
            if (!configuration.reading.sns.topic) {
                throw new Error('Reading sns topic not configured add environment variable SNS_READING_TOPIC');
            }
            this.snsClient.publish(configuration.reading.sns.topic, payload);
        }
    }
}