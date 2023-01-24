import { ConsumeMessage } from "amqplib";
import { inject, injectable } from "inversify";
import { TYPES } from "../global/types";
import { MqttDevice } from "../model/device";
import { SqlDbConnection } from "../forward/db/SqlDbConnection";
import { ServiceClient } from "./serviceClient";
import { ISnsClient } from "../forward/sns/snsClient";
import { configuration } from "../config/config";
import { Logger } from "../utility/logger";


@injectable()
export class DeviceClient implements ServiceClient {

    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection, @inject(TYPES.DeviceSnsClient) private snsClient: ISnsClient) {
    }

    async create(msg: ConsumeMessage, payload: MqttDevice) {

        if (configuration.deviceActionType?.toLowerCase().includes('database')) {
            Logger.debug(`Persistig to database ${configuration.store.database}`);
            await this.dbConnection.builder('homelink.device').insert(payload);
        }

        if (configuration.deviceActionType?.toLowerCase().includes('sns')) {
            if (!configuration.sns.device.topic) {
                throw new Error('Device sns topic not configured add environment variable SNS_DEVICE_TOPIC');
            }
            Logger.debug(`Publishing to sns topic ${configuration.sns.device.topic}`);
            await this.snsClient.publish(configuration.sns.device.topic, payload);
        }
    }
}