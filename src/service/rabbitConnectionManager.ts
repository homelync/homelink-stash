import { injectable } from "inversify";
import { AmqpConnectionManager } from "amqp-connection-manager";
import { Logger } from "../utility/logger";
import { EventCode } from "../model/eventCode";

export interface IRabbitConnectionManager {
    connection: AmqpConnectionManager;
}


@injectable()
export class RabbitConnectionManager implements IRabbitConnectionManager {

    constructor(public connection: AmqpConnectionManager, private url: string) {
        connection.on('connect', () => Logger.debug(`Connected to rabbitMq @ ${url}`, undefined, EventCode.rabbitConnect));
        connection.on('disconnect', () => Logger.warn(`Disconnected from rabbitMq @ ${url}`, undefined, EventCode.rabbitUnblocked));
        connection.on('connectFailed', () => Logger.error(`Disconnected from rabbitMq @ ${url}`, {}, EventCode.rabbitConnectFailed));
        connection.on('unblocked', () => Logger.info(`Unblocked rabbitMq @ ${url}`, undefined, EventCode.rabbitUnblocked));
        connection.on('blocked', () => Logger.error(`Blocked rabbitMq @ ${url}`, {}, EventCode.rabbitBlocked));
    }
}
