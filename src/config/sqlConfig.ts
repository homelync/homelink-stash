import { SqlDialect } from './settings';
export interface SqlConfig {
    dialect: SqlDialect;
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
    timezone: string;
}
