import { plainToClassFromExist } from 'class-transformer';
import { StashSettings } from 'homelink-stash-sdk';

export function getSettings(): StashSettings {
    const settings = new StashSettings();

    try {
        const userSettings = require('../settings.json');
        const parsedSettings = plainToClassFromExist(settings, userSettings);
        return parsedSettings;
    } catch (err) {
        console.warn('Unable to find settings file, assuming you are using environment variables');
    }
    return settings;
}