import { Sequelize, Options } from 'sequelize';
import { configuration } from '../../config/config';
import path from 'path';
import { Logger } from '../../utility/logger';
import { EntityConfig } from 'homelink-stash-sdk';

const sequelizeOptions: Options = {
    dialect: configuration.sqlConfig.dialect,
    host: configuration.sqlConfig.host,
    port: configuration.sqlConfig.port,
    username: configuration.sqlConfig.user,
    password: configuration.sqlConfig.password,
    logging: configuration.logging.loglevel === 'debug'
};

const messageTypeMappings = {
    property: ['001-create-property-table.ts'],
    alert: ['002-create-alert-table.ts'],
    reading: ['003-create-reading-table.ts'],
    notification: ['004-create-notification-table.ts', '005-create-notification-alert-table.ts'],
    device: ['006-create-device-table.ts'],
    insightComponent: ['007-create-insight-component-table.ts'],
    insight: ['008-create-Insight-table.ts'],
    event: ['009-create-event-table.ts']
};

export async function runMigrations() {

    const ensureDatabase = async () => {
        Logger.info('Ensuring database');
        const databaseName = configuration.sqlConfig.database;
        const sequelize = new Sequelize(sequelizeOptions);
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
        await sequelize.query(`USE ${databaseName}`);
        Logger.info('Ensuring database');
    };

    const migrate = async () => {
        const migrationOptions = { ...sequelizeOptions };
        migrationOptions.database = configuration.sqlConfig.database;
        const sequelize = new Sequelize(migrationOptions);
        const queryInterface = sequelize.getQueryInterface();

        const migrationsDir = path.join(__dirname, 'migrations');
        for (const messageType of Object.getOwnPropertyNames(messageTypeMappings)) {
            if (!configuration[messageType]) {
                continue;
            }

            const entityConfig: EntityConfig = configuration[messageType];
            if (!entityConfig.usesDb) {
                continue;
            }

            for (const migrationFile of messageTypeMappings[messageType]) {
                let fileToRun = migrationFile;
                if (configuration.isDocker) {
                    fileToRun = migrationFile.replace('.ts', '.js');
                }
                const migration = require(path.join(migrationsDir, fileToRun));
                if (!migration.up) {
                    continue;
                }

                Logger.debug(`Running migration from file ${migrationFile}`);
                await migration.up(queryInterface, Sequelize);
            }
        }
    };

    try {
        await ensureDatabase();
        await migrate();
        Logger.info('All migrations successfully executed');
    } catch (err) {
        Logger.error('Error executing migrations: ', err);
        process.exit(256);
    }
}