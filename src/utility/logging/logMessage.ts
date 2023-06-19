import { configuration } from '../../config/config';
import { replaceErrors } from './loggingUtilities';
import { inspect } from 'util'

const os = require('os');

export type Level = 'metric' | 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

export class LogMessage {
    private placeholder = '[]';
    constructor(
        public level: Level,
        public message: string,
        public data: any = null,
        public eventId = 0,
        public tag = '',
        public responseTimeMs: number | null = null,
        public method: string = '',
        correlationId?: string) {

        this.createdDate = new Date().toISOString();
        this.environment = configuration?.environment;
        this.machineName = os.hostname();
        this.correlationId = correlationId || '';
    }

    public createdDate: string;
    public environment: string;
    public component = 'homelink-stash';
    public machineName: string;
    public correlationId: string;

    public toLogString() {

        if (configuration?.logging?.human) {
            const humanFormattedData = this.level === 'metric' ? `${this.responseTimeMs}${this.method === 'timing' ? 'ms' : ''}` : JSON.stringify(this.data, replaceErrors, 4);
            if (humanFormattedData && humanFormattedData !== 'null') {
                return `${this.tag} ${this.message} ${humanFormattedData}`;
            }
            return `${this.tag} ${this.message}`;
        }

        const formattedData = this.formatData(this.data);
        return `[${this.level}] ${this.createdDate} ${this.environment} ${this.component} ${this.machineName} ${this.correlationId} ${this.eventId || 0} ${this.tag || this.placeholder} ${this.responseTimeMs || this.placeholder} ${this.method || this.placeholder} [${this.message}] ${formattedData}`;
    }

    private formatData(args: any): string {

        if (!args) {
            return '[]';
        }

        return JSON.stringify(args, replaceErrors).replace(/(\r\n|\n|\r)/gm, '').replace(/\s\s+/g, ' ');
    }
}