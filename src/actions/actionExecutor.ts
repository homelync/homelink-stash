import { inject, injectable } from 'inversify';
import { Config, getDescriptionForMessage } from 'homelink-stash-sdk';
import { EntityType } from '../model/types';
import 'reflect-metadata';
import { Logger } from '../utility/logger';
import { DependencyInjectionContainer } from '../container';
import { TYPES } from '../global/types';
import { getDatafeedForwardRecordId } from '../global/datafeedRecord';
import { IRabbitPublisherService } from 'homelink-stash-sdk/services/rabbitmq/rabbitPublisherService';

@injectable()
export class ActionExecutor {

    constructor(@inject(TYPES.RabbitPublisher) private resultPublisher: IRabbitPublisherService) {
    }

    public async execute(config: Config, entityType: EntityType, payload: object) {
        const entityConfig = config[entityType];
        const dispatcherType = `${entityConfig.actionType}Dispatcher`;
        const dispatcher = DependencyInjectionContainer.get<ActionDispatcher>(TYPES[dispatcherType]);

        Logger.debug(`executing action ${entityConfig.actionType} for ${entityType}`);
        try {
            const dispatcherStatus = await dispatcher.dispatch(payload, entityType);
            await this.recordResult(config, entityType, payload, dispatcherStatus, true);
        } catch (err) {
            const msg = `error executing action ${entityConfig.actionType} for ${entityType}. ${err.message}`;
            Logger.error(msg, err);

            const dispatcherStatus = err.statusCode;
            await this.recordResult(config, entityType, payload, dispatcherStatus, false, msg);
            throw err;
        }
    }

    private async recordResult(config: Config, entityType: EntityType, payload: any, statusCode: number, success: boolean, errMessage: string = '') {
        if (config.logging.suppressRemote) {
            return;
        }

        const landlordReference = payload.landlordReference.toLowerCase();

        await this.resultPublisher.publish({
            registrationId: getDatafeedForwardRecordId(entityType),
            entityType: entityType,
            statusCode: statusCode,
            __IDENTITY: payload.__IDENTITY,
            action: payload.action,
            description: getDescriptionForMessage(payload, entityType),
            success: success,
            errMessage: errMessage,
            executedAt: new Date(),
            landlordReference: landlordReference
        }, {
            exchange: 'dataforward-result-exchange',
            topic: `${landlordReference}.${entityType}`
        });
    }
}

export interface ActionDispatcher {
    dispatch(payload: object, entityType: EntityType): Promise<any>;
    execute(payload: object, config: any, entityType: EntityType): Promise<any>;
}