import { Config, ILogger, SqlConfig, StatusCode } from 'homelink-stash-sdk';
import { DependencyInjectionContainer } from '../../container';
import { TYPES } from '../../global/types';
import { EntityType } from '../../model/types';
import { Logger } from '../../utility/logger';
import { ActionDispatcher } from '../actionExecutor';
import { SqlDbConnection } from './sqlDbConnection';

export class Dispatcher implements ActionDispatcher {

    constructor(private config: Config, private logger: ILogger) {
    }

    public async dispatch(payload: object, entityType: EntityType): Promise<any> {
        const sqlConfig = this.config.sqlConfig;
        await this.execute(payload, sqlConfig, entityType);
    }

    public async execute(payload: object, sqlConfig: SqlConfig, entityType: EntityType): Promise<any> {

        try {
            const database = sqlConfig.database;
            const dbConnection = DependencyInjectionContainer.get<SqlDbConnection>(TYPES.SqlDbConnection);
            Logger.debug(`Persisting to database ${database} database`);
            const record = this.prepareForInsert(payload) as any;
            switch (entityType) {
                case 'property':
                case 'device':
                case 'alert':
                case 'reading':
                    const readingSql = dbConnection.builder(`${database}.${entityType}Message`).insert(record).toString();
                    await dbConnection.executeRaw(`${readingSql} ON DUPLICATE KEY UPDATE __IDENTITY = __IDENTITY;`);
                    break;
                case 'notification':
                    await dbConnection.knexRaw().transaction(async (trx) => {
                        for (const a of record.alerts) {
                            const alertRecord = this.prepareForInsert(a);
                            alertRecord.notificationId = record.notificationId;
                            const notificationAlertSql = dbConnection.builder(`${database}.notificationAlertMessage`).insert(alertRecord).toString();
                            await dbConnection.executeRaw(`${notificationAlertSql} ON DUPLICATE KEY UPDATE __IDENTITY = __IDENTITY;`, trx);
                        }
                        delete (record as any).alerts;
                        const sql = dbConnection.builder(`${database}.notificationMessage`).insert(record).toString();
                        await dbConnection.executeRaw(`${sql} ON DUPLICATE KEY UPDATE __IDENTITY = __IDENTITY;`, trx);
                    });
                    break;
            }
        } catch (err) {
            const msg = `Error persisting to database: ${err.message}`;
            Logger.error(msg, err);

            const error = new Error(msg);
            (error as any).statusCode = StatusCode.failure;
            throw error;
        }

        return StatusCode.success;
    }

    private prepareForInsert<T>(message: T): T {
        const dateColumns = [
            'readingDate',
            'collectionDate',
            'actionTimestamp',
            'raisedDate',
            'resolvedDate',
            'notificationDate',
            'replaceByDate',
            'uninstallationDate',
            'installationDate'
        ];

        const record = { ...message };
        for (const p of Object.getOwnPropertyNames(message)) {
            if (!dateColumns.includes(p) || !message[p]) {
                continue;
            }

            record[p] = new Date(message[p]);
        }

        return record;
    }
}