
import { injectable } from 'inversify';
import { Knex } from 'knex/types';
const knex = require('knex');
import { configuration } from '../../config/config';

@injectable()
export class SqlDbConnection {

    private knex!: Knex;
    constructor() {

        if (!configuration.enableDb) {
            return;
        }

        const sql = configuration.sqlConfig;
        const options: any = {
            encrypt: false,
            connectTimeout: 30000,
            enableArithAbort: false
        };
        this.knex = knex({
            client: sql.dialect,
            debug: false,
            dialect: sql.dialect,
            pool: { min: 0, max: 20 },
            connection: {
                host: sql.host,
                user: sql.user,
                port: sql.port,
                password: sql.password,
                multipleStatements: true,
                database: sql.database,
                options: options,
                timezone: sql.timezone
            }
        });
    }

    public builder(tableName: string): Knex.QueryBuilder {
        this.gaurd();
        return this.knex.table(tableName);
    }

    public async executeRaw(query: string, trx?: Knex.Transaction): Promise<any> {
        const builder = this.knex.raw(query);

        if (trx) {
            (builder as any).transacting(trx);
        }

        return await builder;
    }

    public knexRaw(): Knex {
        this.gaurd();
        return this.knex;
    }

    private gaurd() {
        if (!this.knex) {
            throw new Error('database is not enabled, ensure at least one output action is set to "database"');
        }
    }
}