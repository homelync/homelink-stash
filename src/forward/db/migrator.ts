import { Sequelize, Options } from 'sequelize';
import { configuration } from '../../config/config';
import fs from 'fs';
import path from 'path';
import { Logger } from '../../utility/logger';
import { EntityConfig } from '../../config/rabbitConfig';

const sequelizeOptions: Options = {
    dialect: configuration.store.dialect,
    host: configuration.store.host,
    port: configuration.store.port,
    username: configuration.store.user,
    password: configuration.store.password,
};

const messageTypeMappings = {
    property: ['001-create-property-table.ts'],
    alert: ['002-create-alert-table.ts'],
    reading: ['003-create-reading-table.ts'],
    notification: ['004-create-notification-table.ts', '005-create-notification-alert-table.ts'],
    device: ['006-create-device-table.ts']
}

export async function runMigrations() {

    const ensureDatabase = async () => {
        Logger.info('Ensuring database');
        const databaseName = configuration.store.database;
        const sequelize = new Sequelize(sequelizeOptions);
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
        await sequelize.query(`USE ${databaseName}`);
        Logger.info('Ensuring database');
    }

    const migrate = async () => {
        const migrationOptions = { ...sequelizeOptions };
        migrationOptions.database = configuration.store.database;
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
                const migration = require(path.join(migrationsDir, migrationFile));
                if (!migration.up) {
                    continue;
                }

                console.log(`Running migration from file ${migrationFile}`);
                await migration.up(queryInterface, Sequelize);
            }
        }
    }

    try {
        await ensureDatabase();
        await migrate();
        console.log('All migrations successfully executed');
    } catch (err) {
        console.error('Error executing migrations: ', err);
        process.exit(256);
    }
};