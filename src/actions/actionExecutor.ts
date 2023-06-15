import { injectable } from 'inversify';
import { Config } from 'homelink-stash-sdk';
import { EntityType } from '../model/types';
import 'reflect-metadata';
import { Logger } from '../utility/logger';
import { DependencyInjectionContainer } from '../container';
import { TYPES } from '../global/types';

@injectable()
export class ActionExecutor {
    public async execute(config: Config, entityType: EntityType, payload: object) {
        const entityConfig = config[entityType];
        const dispatcherType = `${entityConfig.actionType}Dispatcher`;
        const dispatcher = DependencyInjectionContainer.get<ActionDispatcher>(TYPES[dispatcherType]);
        Logger.debug(`executing action ${entityConfig.actionType} for ${entityType}`);
        try {
            await dispatcher.dispatch(payload, entityType);
        } catch (err) {
            console.error(err.message);
            Logger.error(`error executing action ${entityConfig.actionType} for ${entityType}`, err);
            throw err;
        }
    }
}

export interface ActionDispatcher {
    dispatch(payload: object, entityType: EntityType): Promise<void>;
    execute(payload: object, config: any, entityType: EntityType): Promise<void>;
}