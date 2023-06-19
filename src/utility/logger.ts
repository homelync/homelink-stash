
import * as logger from 'winston';
import { configuration } from '../config/config';
import { LogMessage } from './logging/logMessage';

import { camelToHuman, titleCase } from './stringUtils';
import { EventCode } from '../model/eventCode';
import { injectable } from 'inversify';
import { ILogger } from 'homelink-stash-sdk';
import 'reflect-metadata';
var colors = require('colors/safe');

const { timestamp, printf } = logger.format;

const LEVEL = Symbol.for('level');
const MESSAGE = Symbol.for('message');

const format = (info: any) => {
    if (info && info.toLogString) {
        return info.toLogString();
    }

    if (info && info.message && info.message.toLogString) {
        return info.message.toLogString();
    }

    return info;
};

const transports: any[] = [];

const enableConsoleLogger = true;

if (enableConsoleLogger) {

    transports.push(new logger.transports.Console({
        //
        // This is required as ecs logs do not listen to stdout but rather console.log
        // this override intercepts stdout and redirects to console.log
        //
        log(info, callback) {
            setImmediate(() => (this as any).emit('logged', info));

            if (this.stderrLevels && this.stderrLevels[info[LEVEL]]) {
                console.error(info[MESSAGE]);

                if (callback) {
                    callback();
                }
                return;
            }

            console.log(info[MESSAGE]);

            if (callback) {
                callback();
            }
        }
    }));
}

const consoleFormat = printf(info => {

    if (configuration?.environment === 'local') {
        switch (info.level) {
            case 'warn': return colors.yellow(format(info));
            case 'error': return colors.red(format(info));
            case 'debug': return colors.green(format(info));
            default: return format(info);
        }
    } else {
        return format(info);
    }
});

logger.configure({
    // Probably an issue with config, so log everthing as it's likely a startup error
    level: configuration?.logging?.loglevel || 'debug',
    format: logger.format.combine(
        timestamp(),
        consoleFormat
    ),
    transports: transports,
    levels: {
        error: 0,
        warn: 1,
        metric: 2,
        info: 3,
        http: 4,
        verbose: 5,
        debug: 6
    }
});

export type Level = 'error' | 'warn' | 'metric' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

export const stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

export class Logger {
    public static readonly shouldLog: boolean = true;
    public static readonly winston = logger;

    public static timing(name: string, value: number, eventId = 1209, context?: string, method?: string) {
        Logger.metric('timing', `${name}-ms`, value, eventId, context, method);
    }

    public static count(name: string, value: number, eventId = 1210, context?: string, method?: string) {
        Logger.metric('counter', `${name}-counter`, value, eventId, context, method);
    }

    public static metric(type: 'counter' | 'timing', name: string, value: number, eventId: number, context?: string, method?: string) {
        if (Logger.shouldLog) {
            const metric = {
                data: { metricName: name, metricValue: value },
                type: type,
                context: context,
                unit: type === 'timing' ? 'ms' : 'count'
            };

            Logger.winston.log({
                level: 'metric',
                message: new LogMessage(
                    'metric',
                    titleCase(camelToHuman(EventCode[eventId])),
                    metric,
                    eventId,
                    name,
                    value,
                    (method || type).toUpperCase())
            } as any);
        }
    }

    public static error(message: string, data: any, eventId = 0, tag = '', correlationId?: string): void {
        if (Logger.shouldLog) Logger.winston.error(new LogMessage('error', message, data, eventId, tag, undefined, undefined, correlationId));
    }

    public static warn(message: string, data: any = null, eventId = 0, tag = '', correlationId?: string): void {
        if (Logger.shouldLog) Logger.winston.warn(new LogMessage('warn', message, data, eventId, tag, undefined, undefined, correlationId));
    }

    public static info(message: string, data: any = null, eventId = 0, tag = '', correlationId?: string): void {
        if (Logger.shouldLog) Logger.winston.info(new LogMessage('info', message, data, eventId, tag, undefined, undefined, correlationId));
    }

    public static verbose(message: string, data: any = null, eventId = 0, tag = '', correlationId?: string): void {
        if (Logger.shouldLog) Logger.winston.verbose(new LogMessage('verbose', message, data, eventId, tag, undefined, undefined, correlationId));
    }

    public static debug(message: string, data: any = null, eventId = 0, tag = '', correlationId?: string): void {
        if (Logger.shouldLog) Logger.winston.debug(new LogMessage('debug', message, data, eventId, tag, undefined, undefined, correlationId));
    }
}
