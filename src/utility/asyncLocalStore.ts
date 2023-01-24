import { Logger } from '../utility/logger';
import uuid = require('uuid');
import { MessageType } from '../model/messageType';

const hooked = require('cls-hooked');
const namespaceKey = 'message';
const correlationIdKey = 'correlationId';
const messageTypeKey = 'messageType';
const taskIdKey = 'taskId';

export function getCorrelationId(): string {
    const correlationId = getStoredValue(correlationIdKey);
    return correlationId;
}

export function getMessageType(): string {
    const messageType = getStoredValue(messageTypeKey);
    return messageType;
}

export function getTaskId(): string {
    const taskId = getStoredValue(taskIdKey);
    return taskId;
}

export function createAsyncLocalNamespace() {
    return hooked.getNamespace(namespaceKey) || hooked.createNamespace(namespaceKey);
}

export function setCorrelationId(correlationId: string, messageType: MessageType, context?: string): void {
    var getNamespace = hooked.getNamespace;
    var ns = getNamespace(namespaceKey);
    if (!correlationId) {
        correlationId = uuid.v4();
    }

    Logger.debug('Setting correlationId: ' + correlationId);
    ns.set(correlationIdKey, correlationId);
    const taskId = uuid.v4();
    Logger.debug('Setting taskId: ' + taskId);
    ns.set(taskIdKey, taskId);
    Logger.debug('Setting messageType: ' + messageType);
    ns.set(messageTypeKey, messageType);
}

function getStoredValue(key: string): string {
    var getNamespace = hooked.getNamespace;
    var session = getNamespace(namespaceKey);
    var value = 'reading-consumer-system';
    if (session && session.get(key)) {
        value = session.get(key);
    }

    return value;
}