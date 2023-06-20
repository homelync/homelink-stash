import { ActionDispatcher, Config, ILogger, StatusCode } from 'homelink-stash-sdk';
import { inspect } from 'util';
import { SnsConfig } from '../../config/snsConfig';
import { DependencyInjectionContainer } from '../../container';
import { TYPES } from '../../global/types';
import { EntityType } from '../../model/types';
import { Logger } from '../../utility/logger';
import { titleCase } from '../../utility/stringUtils';
import { SnsClient } from './snsClient';

export class Dispatcher implements ActionDispatcher {

  constructor(private config: Config, private logger: ILogger) {
  }

  public async dispatch(payload: object, entityType: EntityType): Promise<number> {
    const snsConfig = this.config[entityType].sns;
    return await this.execute(payload, snsConfig, entityType);
  }

  public async execute(payload: object, snsConfig: SnsConfig, entityType: EntityType): Promise<number> {
    const snsClient = DependencyInjectionContainer.get<SnsClient>(TYPES[`${titleCase(entityType)}SnsClient`]);

    try {
      this.logger.debug(`Publishing to Sns`, {});
      const response = await snsClient.publish(snsConfig.topic, payload);
      this.logger.debug(`Published to Sns with message id  ${response.MessageId} and sequenceNumber: ${response.SequenceNumber}`, {});
    } catch (err) {
      const msg = `Error publishing to sns: ${err.message}`;
      Logger.error(msg, inspect(err));

      const error = new Error(msg);
      (error as any).statusCode = StatusCode.failure;
      throw error;
    }

    return StatusCode.success;
  }
}