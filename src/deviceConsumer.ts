import { ConsumerBase } from './consumerBase';
import { inject, injectable } from 'inversify';
import { TYPES } from './global/types';
import { IRabbitConnectionManager } from './service/rabbitConnectionManager';
import { RabbitConsumeConfig } from 'homelinkstash-plugin-sdk';
import { MessageType } from './model/messageType';
import { ActionExecutor } from './actions/actionExecutor';
@injectable()
export class DeviceConsumer extends ConsumerBase {
    constructor(@inject(TYPES.ActionExecutor) actionExecutor: ActionExecutor,
        @inject(TYPES.DeviceRabbitConfig) config: RabbitConsumeConfig,
        @inject(TYPES.RabbitConnectionManager) protected connectionManager: IRabbitConnectionManager) {

        super(actionExecutor, config, connectionManager, MessageType.device);
    }
}