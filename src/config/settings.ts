import { plainToClassFromExist } from 'class-transformer';
import { SqlDialect } from 'homelink-stash-sdk';

export class LoggingSettings {
    public level: string = 'info';
    public human: boolean = false;
    public suppressRemote: boolean = false;
}

export class BrokerSettings {
    public host: string = '';
    public port: number = 1234;
}

export class SystemSettings {
    public broker: BrokerSettings = new BrokerSettings();
}

export class SnsSettings {
    public topic: string = '';
    public clientId: string = '';
    public secret: string = '';
}

export class SqlSettings {
    public dialect: SqlDialect = 'mysql';
    public host: string = '';
    public user: string = '';
    public password: string = '';
    public port: number = 3306;
    public database: string = 'integration';
    public timezone: string = '+00:00';
}

export type AuthenticationType = 'none' | 'basic' | 'apiKey' | 'bearer';

export class HookSettings {
    public endpoint: string = '';
    public authenticationMethod: AuthenticationType = 'none';
    public successCodes: string = '200';
    public method: string = 'POST';
    public username: string = '';
    public password: string = '';
}

export class EntitySettings {
    public action: string = '';
    public sns: SnsSettings = new SnsSettings();
    public webhook: HookSettings = new HookSettings();
    public enabled: boolean = false;
}

export class EntitiesSettings {
    public device: EntitySettings = new EntitySettings();
    public property: EntitySettings = new EntitySettings();
    public notification: EntitySettings = new EntitySettings();
    public alert: EntitySettings = new EntitySettings();
    public reading: EntitySettings = new EntitySettings();
}

export interface PluginSettings {
    name: string;
    settings: any;
}
export class Settings {
    public landlordReference: string = '';
    public password: string = '';
    public entities: EntitiesSettings = new EntitiesSettings();
    public database: SqlSettings = new SqlSettings();
    public logging: LoggingSettings = new LoggingSettings();
    public system: SystemSettings = new SystemSettings();
    public httpTimeout = 2000;
    public plugins: PluginSettings[] = [];
}

export function getSettings(): Settings {
    const settings = new Settings();

    try {
        const userSettings = require('../settings.json');
        const parsedSettings = plainToClassFromExist(settings, userSettings);
        return parsedSettings;
    } catch (err) {
        console.warn('Unable to find settings file, assuming you are using environment variables');
    }
    return settings;
}