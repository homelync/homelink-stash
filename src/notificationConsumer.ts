import { ConsumerBase } from './consumerBase';
import { ServiceClient } from './client/serviceClient';
import { inject, injectable } from 'inversify';
import { TYPES } from './global/types';
import { IRabbitConnectionManager } from './service/rabbitConnectionManager';
import { RabbitConsumeConfig } from './config/rabbitConfig';
import { MessageType } from './model/messageType';
@injectable()
export class NotificationConsumer extends ConsumerBase {
    constructor(@inject(TYPES.NotificationClient) serviceClient: ServiceClient,
        @inject(TYPES.NotificationRabbitConfig) config: RabbitConsumeConfig,
        @inject(TYPES.RabbitConnectionManager) protected connectionManager: IRabbitConnectionManager) {

        super(serviceClient, config, connectionManager, MessageType.notification);
    }
}