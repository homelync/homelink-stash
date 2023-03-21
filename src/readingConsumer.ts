import { ConsumerBase } from './consumerBase';
import { ServiceClient } from './client/serviceClient';
import { inject, injectable } from 'inversify';
import { TYPES } from './global/types';
import { IRabbitConnectionManager } from './service/rabbitConnectionManager';
import { RabbitConsumeConfig } from './config/rabbitConfig';
import { MessageType } from './model/messageType';
@injectable()
export class ReadingConsumer extends ConsumerBase {
    constructor(@inject(TYPES.ReadingClient) serviceClient: ServiceClient,
        @inject(TYPES.ReadingRabbitConfig) config: RabbitConsumeConfig,
        @inject(TYPES.RabbitConnectionManager) protected connectionManager: IRabbitConnectionManager) {

        super(serviceClient, config, connectionManager, MessageType.reading);
    }
}