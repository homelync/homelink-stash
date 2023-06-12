import { Config } from "../../config/config";
import { SnsConfig } from "../../config/snsConfig";
import { DependencyInjectionContainer } from "../../container";
import { TYPES } from "../../global/types";
import { EntityType } from "../../model/types";
import { titleCase } from "../../utility/stringUtils";
import { SnsClient } from "./snsClient";

export class Dispatcher {

    private snsConfig: SnsConfig;
    constructor(private config: Config, private entityType: EntityType) {
        this.snsConfig = config[entityType].sns
    }

    public async dispatch(payload: object) {
      const snsCliet = DependencyInjectionContainer.get<SnsClient>(TYPES[`${titleCase(this.entityType)}SnsClient`])
      // TODO: handle response?
      await snsCliet.publish(this.snsConfig.topic, payload);
    }
}

module.exports = Dispatcher;