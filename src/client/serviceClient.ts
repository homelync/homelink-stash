import { ConsumeMessage } from 'amqplib';

export interface ServiceClient {
    create(msg: ConsumeMessage, payload: any): any;
}