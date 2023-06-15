import { Config } from 'homelinkstash-plugin-sdk';
import { SnsConfig } from '../../config/snsConfig';
import { DependencyInjectionContainer } from '../../container';
import { TYPES } from '../../global/types';
import { EntityType } from '../../model/types';
import { titleCase } from '../../utility/stringUtils';
import { ActionDispatcher } from '../actionExecutor';
import { SnsClient } from './snsClient';

export class Dispatcher implements ActionDispatcher {

  constructor(private config: Config) {
  }

  public async dispatch(payload: object, entityType: EntityType): Promise<void> {
    const snsConfig = this.config[entityType].sns;
    this.execute(payload, snsConfig, entityType);
  }

  public async execute(payload: object, snsConfig: SnsConfig, entityType: EntityType): Promise<void> {
    const snsClient = DependencyInjectionContainer.get<SnsClient>(TYPES[`${titleCase(entityType)}SnsClient`]);
    // TODO: handle response?
    await snsClient.publish(snsConfig.topic, payload);
  }
}