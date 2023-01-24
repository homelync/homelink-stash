import { inject } from "inversify";
import { TYPES } from "../../global/types";
import { Logger } from "../../utility/logger";
import { SqlDbConnection } from "../db/SqlDbConnection";

export class DeviceTable {
    constructor(@inject(TYPES.SqlDbConnection) private dbConnection: SqlDbConnection) {
    }
    public async create(): Promise<void> {
        Logger.info('---Ensuring device table');

        const sql = `
                IF NOT EXISTS (select * from sys.tables t
                    inner join sys.schemas s on s.schema_id = t.schema_id
                    where t.name = 'device' and s.name = 'homelink')
                BEGIN
                    CREATE TABLE homelink.device (
                        virtualId UNIQUEIDENTIFIER NOT NULL,
                        serialNumber VARCHAR(255) NOT NULL,
                        landlordReference VARCHAR(255) NOT NULL,
                        propertyReference VARCHAR(255) NOT NULL,
                        propertyDisplayReference VARCHAR(255) NOT NULL,
                        [name] VARCHAR(255) NOT NULL,
                        [location] VARCHAR(255) NOT NULL,
                        [locationNickname] VARCHAR(255) NULL,
                        model  VARCHAR(255) NOT NULL,
                        [status] VARCHAR(10) NOT NULL,
                        [type] VARCHAR(100) NOT NULL,
                        installationDate DATETIME2(3) NOT NULL,
                        replaceByDate DATETIME2(3) NOT NULL,
                        installedBy VARCHAR(255) NOT NULL,
                        [action] NVARCHAR(6) NOT NULL,
                        actionTimestamp DATETIME2(4) NOT NULL,
                        address1 NVARCHAR(255) NOT NULL,
                        address2 VARCHAR(255) NULL,
                        city NVARCHAR(255) NOT NULL,
                        postcode NVARCHAR(10) NOT NULL,
                        country NVARCHAR(255) NOT NULL,
                        addressConfidence NVARCHAR(10) NOT NULL
                    )
                END
        `;

        Logger.info('---Device table ensured');

        await this.dbConnection.knexRaw().raw(sql);
    }
}

