import { inject } from 'inversify';
import { TYPES } from '../../../global/types';
import { Logger } from '../../../utility/logger';
import { SqlDbConnection } from '../SqlDbConnection';

export class PropertyTable {
    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection) {
    }
    public async create(): Promise<void> {
        Logger.info('---Ensuring device table');

        const sql = `
                CREATE TABLE IF NOT EXISTS propertyMessage (
                    __IDENTITY char(255) NOT NULL,
                    action varchar(10) NOT NULL,
                    actionTimestamp datetime(3) NOT NULL,
                    address1 varchar(255) NOT NULL,
                    address2 varchar(255) DEFAULT NULL,
                    addressConfidence varchar(10) NOT NULL,
                    city varchar(255) NOT NULL,
                    country varchar(255) NOT NULL,
                    deviceCount int NOT NULL,
                    installedBy varchar(255) DEFAULT NULL,
                    landlordReference varchar(255) NOT NULL,
                    postcode varchar(255) NOT NULL,
                    propertyDisplayReference varchar(255) NOT NULL,
                    propertyId char(36),
                    propertyReference varchar(255) NOT NULL,
                    createdAt datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    PRIMARY KEY (propertyId, actionTimestamp, action)
                ) ENGINE=InnoDB;
        `;

        Logger.info('---Device table ensured');

        await this.dbConnection.knexRaw().raw(sql);
    }
}
