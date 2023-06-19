import { Logger } from '../utility/logger';
import { Channel, ConsumeMessage } from 'amqplib';
import { RabbitConsumeConfig } from 'homelink-stash-sdk';
import { EventCode } from '../model/eventCode';
import { MessageType } from '../model/messageType';

export async function handleError(errMsg: string, exp: Error, config: RabbitConsumeConfig, msg: ConsumeMessage, channel: Channel, messageType: MessageType) {
    Logger.warn(`Rejecting - ${messageType} message`, exp.message || exp, EventCode.retryingMessage, messageType);
    const rejectReason = getRejectReason(exp, config);

    await requeue(rejectReason, channel, config.deadLetterExchange, msg);
}

export async function handleWithRetries(errMsg: string, exp: Error, config: RabbitConsumeConfig, msg: ConsumeMessage, channel: Channel, messageType: MessageType) {
    Logger.error(errMsg, exp);
    Logger.debug('Handling error');
    const exchangeDeathCount = getXDeathCount(msg, config);

    if (shouldRetry(msg, config, exchangeDeathCount)) {
        Logger.warn(`Rejecting - message will be retried ${exchangeDeathCount} of ${config.maxRetry}`, exp.message || exp, EventCode.retryingMessage, messageType);
        channel.reject(msg, false);
    } else {
        Logger.warn(`Deadlettering - max retries exceeded. ${config.maxRetry} of ${config.maxRetry}`, exp.message || exp, EventCode.deadletteringMessage, messageType);
        const rejectReason = getRejectReason(exp, config);
        await requeue(rejectReason, channel, config.deadLetterExchange, msg);
    }
}

export function shouldRetry(msg: ConsumeMessage, config: RabbitConsumeConfig, exchangeDeathCount: number): boolean {
    Logger.debug(`Exchange death: ${exchangeDeathCount}. Max retry ${config.maxRetry}`);
    return exchangeDeathCount < (config.maxRetry || 0);
}

export function getXDeathCount(msg: ConsumeMessage, config: RabbitConsumeConfig): number {
    const xDeath = msg.properties.headers['x-death'];
    Logger.debug('Message Headers:', JSON.stringify(msg.properties.headers));

    const exchangeDeathCount = xDeath
        && xDeath.find(x => x.exchange === 'amq.topic') ? xDeath.find(x => x.exchange === 'amq.topic')!.count
        // If shovel has been used to requeue items, then the normal exchange x-death object is instead replaced with a
        // x-death object with a empty exchange attribute, if that's there, use it.
        : xDeath && xDeath.find(x => !x.exchange) ? xDeath.find(x => !x.exchange)!.count : 0;

    return exchangeDeathCount;
}

async function requeue(rejectReason: string, channel: Channel, exchange: string, msg: ConsumeMessage) {

    try {
        await channel.publish(exchange, msg.fields.routingKey, msg.content, {
            persistent: true,
            headers: { 'x-reject-reason': rejectReason }
        });
    } catch (err: any) {
        Logger.warn(`Reject reason could not be published: ${rejectReason}.`, err.message);
        await channel.publish(exchange, msg.fields.routingKey, msg.content, {
            persistent: true
        });
    }
    await channel.ack(msg);
}

function getRejectReason(exp: Error, config: RabbitConsumeConfig): string {
    let rejectReason = (exp as any).sqlMessage ? `SQL ERROR on table ${config.queue.split('.')[1]}Message: ${(exp as any).sqlMessage}` : exp.message;
    if (rejectReason && rejectReason.length > 1000) {
        rejectReason = rejectReason.substring(0, 1000);
    }

    return rejectReason;
}