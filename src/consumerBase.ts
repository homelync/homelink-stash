import { Channel, ConsumeMessage } from 'amqplib';
import { ServiceClient } from './client/serviceClient';

import { injectable, unmanaged } from 'inversify';
import uuid = require('uuid');

import { IRabbitConnectionManager } from './service/rabbitConnectionManager';
import { ChannelWrapper } from 'amqp-connection-manager';

import { Logger } from './utility/logger';
import { configuration } from './config/config';
import { createAsyncLocalNamespace, setCorrelationId } from './utility/asyncLocalStore';
import { handleError } from './utility/errorHandler';
import { EventCode } from './model/eventCode';

import { Timing } from './utility/timing';
import { MessageType } from './model/messageType';
import { RabbitConsumeConfig } from './config/rabbitConfig';

@injectable()
export class ConsumerBase {

    private channel: ChannelWrapper;

    constructor(serviceClient: ServiceClient,
        rabbitConsumeConfig: RabbitConsumeConfig,
        connectionManager: IRabbitConnectionManager,
        @unmanaged() messageType: MessageType
    ) {

        Logger.debug(`Creating channel for ${configuration.rabbitHost.host}/${configuration.rabbitHost.vhost?.toLowerCase()}/${rabbitConsumeConfig.queue}`);
        this.channel = connectionManager.connection.createChannel({
            publishTimeout: configuration.rabbitHost.publishTimeoutMs,
            setup: function (channel: Channel) {
                channel.prefetch(rabbitConsumeConfig.prefetch || 1000);
                channel.consume(rabbitConsumeConfig.queue, async (msg: ConsumeMessage | null): Promise<void> => {
                    if (msg) {
                        let correlationId = uuid.v4();
                        if (msg.properties && msg.properties.headers) {
                            correlationId = msg.properties.headers.correlationId;
                        }

                        await createAsyncLocalNamespace().runAndReturn(async () => {
                            setCorrelationId(correlationId, messageType);

                            const timing = new Timing(`${messageType}-consume`);

                            try {
                                const payload: any = JSON.parse(msg.content.toString());

                                if (!payload) {
                                    throw new Error('Message did not have a payload');
                                }

                                const operation = `${messageType} message-received`;
                                Logger.count(operation, 1);
                                Logger.debug('Message Received', payload, EventCode.messageReceived, messageType);

                                const fs = require('fs');

                                var stream = fs.createWriteStream(`./logOutput/${messageType}.log`, { flags: 'a' });
                                stream.write(JSON.stringify(payload, null, 4));
                                stream.end();

                                await serviceClient.create(msg, payload);
                                channel.ack(msg);

                            } catch (exp) {
                                const err = 'Error processing message: ' + msg.content.toString();
                                await handleError(err, (exp as any), rabbitConsumeConfig, msg, channel, messageType);
                            } finally {
                                timing.stop(EventCode.messageProcessed);
                            }
                        });
                    }
                });
            }
        });
    }

    public close(): Promise<void> {
        return this.channel.close();
    }
}