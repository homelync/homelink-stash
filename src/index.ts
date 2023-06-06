import { ensureSchema, startAllConsumers } from './app';
import { loadConfig } from './config/config';
import { Logger } from './utility/logger';

loadConfig()
    .then(() =>
        ensureSchema()
            .then(() =>
                startAllConsumers()
                    .then(() => console.log('Consumers initialised. Listening.....'))
                    .catch(err => Logger.error('Error initialising consumers', err))
            )
            .catch(err => Logger.error('Error ensure database schema', err)))
    .catch(err => Logger.error('Error loading config', err));