import { ConsumeMessage } from "amqplib";
import { inject, injectable } from "inversify";
import { TYPES } from "../global/types";
import { SqlDbConnection } from "../forward/db/SqlDbConnection";
import { ServiceClient } from "./serviceClient";
import { ISnsClient } from "../forward/sns/snsClient";
import { configuration } from "../config/config";
import { Logger } from "../utility/logger";
import { MqttProperty } from "../model/reading";

@injectable()
export class PropertyClient implements ServiceClient {

    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection, @inject(TYPES.PropertySnsClient) private snsClient: ISnsClient) {
    }

    async create(msg: ConsumeMessage, payload: MqttProperty) {

        if (configuration.property.usesDb) {
            Logger.debug(`Persisting to database ${configuration.store.database}`);
            await this.dbConnection.builder('homelink.property').insert(payload);
        }

        if (configuration.property.usesSns) {
            if (!configuration.property.sns.topic) {
                throw new Error('Property sns topic not configured add environment variable SNS_PROPERTY_TOPIC');
            }
            this.snsClient.publish(configuration.property.sns.topic, payload);
        }
    }
}