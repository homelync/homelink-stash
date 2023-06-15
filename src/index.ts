import { ensureSchema, initialisePlugins, startAllConsumers } from './app';
import { loadConfig } from './config/config';
import { Logger } from './utility/logger';

async function runStartup() {
    await loadConfig();
    await initialisePlugins();
    await ensureSchema();
    await startAllConsumers();
}

runStartup()
    .then(() => console.log('Stash initialised. Listening.....'))
    .catch(err => Logger.error('Error initialising stash', err));
