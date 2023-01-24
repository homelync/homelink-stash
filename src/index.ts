import { ensureSchema, startAllConsumers } from './app';
import { Logger } from './utility/logger';

ensureSchema()
    .then(() =>
        startAllConsumers()
            .then(() => Logger.info('Consumers initialised'))
            .catch(err => Logger.error('Error initialising consumers', err))
    )
    .catch(err => Logger.error('Error ensure database schema', err));