import { ConsumerBase } from './consumerBase';
import { inject, injectable } from 'inversify';
import { TYPES } from './global/types';
import { IRabbitConnectionManager } from './service/rabbitConnectionManager';
import { RabbitConsumeConfig } from 'homelink-stash-sdk';
import { MessageType } from './model/messageType';
import { ActionExecutor } from './actions/actionExecutor';
@injectable()
export class AlertConsumer extends ConsumerBase {
    constructor(@inject(TYPES.ActionExecutor) actionExecutor: ActionExecutor,
        @inject(TYPES.AlertRabbitConfig) config: RabbitConsumeConfig,
        @inject(TYPES.RabbitConnectionManager) protected connectionManager: IRabbitConnectionManager) {

        super(actionExecutor, config, connectionManager, MessageType.alert);
    }
}