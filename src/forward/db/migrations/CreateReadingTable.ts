import { inject } from 'inversify';
import { TYPES } from '../../../global/types';
import { Logger } from '../../../utility/logger';
import { SqlDbConnection } from '../SqlDbConnection';

export class ReadingTable {
    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection) {
    }
    public async create(): Promise<void> {
        Logger.info('---Ensuring reading table');

        const sql = `
                CREATE TABLE IF NOT EXISTS readingMessage (
                    __IDENTITY varchar(255) NOT NULL,
                    action varchar(10) NOT NULL,
                    actionTimestamp datetime(3) NOT NULL,
                    collectionDate datetime(3) NOT NULL,
                    deviceId char(36) NOT NULL,
                    devicePhySerialNumber varchar(255) NOT NULL,
                    deviceSerialNumber varchar(255) NOT NULL,
                    landlordReference varchar(255) NOT NULL,
                    location varchar(255) NOT NULL,
                    locationNickname varchar(255) DEFAULT NULL,
                    manufacturerReference varchar(255) NOT NULL,
                    propertyDisplayReference varchar(255) NOT NULL,
                    propertyId char(36) NOT NULL,
                    propertyReference varchar(255) NOT NULL,
                    readingDate datetime(3) NOT NULL,
                    readingTypeId varchar(100) NOT NULL,
                    room varchar(255) NOT NULL,
                    sourceModel varchar(255) NOT NULL,
                    sourceModelType varchar(255) NOT NULL,
                    unit varchar(255) NOT NULL,
                    value decimal(25,15) NOT NULL,
                    PRIMARY KEY (deviceId, readingDate, readingTypeId)
                ) ENGINE=InnoDB;
        `;

        Logger.info('---Reading table ensured');

        await this.dbConnection.knexRaw().raw(sql);
    }
}
