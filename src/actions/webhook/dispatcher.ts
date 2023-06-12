import { HookConfig } from "../../config/hookConfig";
import fetch from 'node-fetch';
import { Config } from "../../config/config";
import { EntityType } from "../../model/types";

export class Dispatcher {
    private hookConfig: HookConfig;
    constructor(config: Config, entityType: EntityType) {
        this.hookConfig = config[entityType].hook
    }

    public async dispatch(payload: object) {
        const requestInit = this.constructHookRequest(payload);
        const response = await fetch(this.hookConfig.endpoint, requestInit as any);

        const successCode = this.hookConfig.successCodes.length ? this.hookConfig.successCodes : [200, 201, 202];

        if (!successCode.includes(response.status)) {
            throw new Error(`Hook failed with status code ${response.status}`);
        }
    }

    private constructHookRequest(payload: object): RequestInit {

        const headers = {} as any;
        headers['content-type'] = 'application/json';

        switch (this.hookConfig.authenticationMethod) {
            case 'basic':
                const credentials = Buffer.from(`${this.hookConfig.username}:${this.hookConfig.password}`).toString('base64');
                headers['authorization'] = `Basic ${credentials}`;
                break;
            case 'apiKey':
                headers[this.hookConfig.username] = this.hookConfig.password;
                break;
            case 'bearer':
                headers['authorization'] = `Bearer ${this.hookConfig.password}`;
                break;
        }

        const requestInit: RequestInit = {
            method: this.hookConfig.method,
            body: JSON.stringify(payload),
            headers: headers
        };

        return requestInit;
    }
}

module.exports = Dispatcher;