import { ILogger } from 'homelink-stash-sdk';
import { injectable } from 'inversify';
import { Logger } from '../logger';

@injectable()
export class InstanceLogger implements ILogger {
    public timing(name: string, value: number, eventId = 1209, context?: string, method?: string) {
        Logger.timing(name, value, eventId, context, method);
    }

    public count(name: string, value: number, eventId = 1209, context?: string, method?: string) {
        Logger.count(name, value, eventId, context, method);
    }

    public info(message: string, data: any = null, eventId = 0, tag = ''): void {
        Logger.info(message, data, eventId, tag);
    }

    public debug(message: string, data: any = null, eventId = 0, tag = ''): void {
        Logger.debug(message, data, eventId, tag);
    }

    public verbose(message: string, data: any = null, eventId = 0, tag = ''): void {
        Logger.verbose(message, data, eventId, tag);
    }

    public warn(message: string, data: any = null, eventId = 0, tag = ''): void {
        Logger.warn(message, data, eventId, tag);
    }

    public error(message: string, data: any, eventId = 0, tag = ''): void {
        Logger.error(message, data, eventId, tag);
    }
}