import { injectable } from 'inversify';
import { Config } from '../config/config';
import { EntityType } from '../model/types';
import 'reflect-metadata';
import { Logger } from '../utility/logger';

@injectable()
export class ActionExecutor {
    public async execute(config: Config, entityType: EntityType, payload: object) {
        const entityConfig = config[entityType];
        const Dispatcher = require(`./${entityConfig.actionType}/dispatcher`);
        const dispatcher = new Dispatcher(config, entityType);
        Logger.debug(`executing action ${entityConfig.actionType} for ${entityType}`);
        try {
            await dispatcher.dispatch(payload);
        } catch(err) {
            console.error(err.message);
            Logger.error(`error executing action ${entityConfig.actionType} for ${entityType}`, err);
            throw err;
        }
    }
}

