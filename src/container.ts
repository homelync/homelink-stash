import { Container } from 'inversify';
import 'reflect-metadata';
import { connect as amqpConnect } from 'amqp-connection-manager';
import { configuration } from './config/config';
import { TYPES } from './global/types';
import { DeviceConsumer } from './deviceConsumer';
import { ConsumerBase } from './consumerBase';
import { SqlDbConnection } from './actions/database/sqlDbConnection';
import { AlertConsumer } from './alertConsumer';
import { AlertSnsClient, DeviceSnsClient, ISnsClient, NotificationSnsClient, PropertySnsClient, ReadingSnsClient } from './actions/sns/snsClient';
import { NotificationConsumer } from './notificationConsumer';
import { PropertyConsumer } from './propertyConsumer';
import { ReadingConsumer } from './readingConsumer';
import { ActionDispatcher, ActionExecutor } from './actions/actionExecutor';
import { WebhookDispatcher, RabbitConsumeConfig, RabbitPublisherService } from 'homelink-stash-sdk';
import { Dispatcher as SnsDispatcher } from './actions/sns/dispatcher';
import { Dispatcher as DatabaseDispatcher } from './actions/database/dispatcher';
import { ILogger } from 'homelink-stash-sdk';
import { IRabbitConnectionManager, RabbitConnectionManager } from 'homelink-stash-sdk/services/rabbitmq/rabbitConnectionManager';
import { IRabbitPublisherService } from 'homelink-stash-sdk/services/rabbitmq/rabbitPublisherService';
import { InstanceLogger } from './utility/logging/instanceLogger';

let DependencyInjectionContainer = new Container();

function getConnectionManager(vhost: string): IRabbitConnectionManager {
    const rabbitUrl = configuration.rabbitHost.port
        ? `${configuration.rabbitHost.host}:${configuration.rabbitHost.port}`
        : configuration.rabbitHost.host;

    const protocol = configuration.rabbitHost.tls ? 'amqps://' : 'amqp://';
    const connectionString = `${protocol}${configuration.rabbitHost.username}:${configuration.rabbitHost.password}@${rabbitUrl}/${vhost}`;
    const amqpConnectionManager = amqpConnect([connectionString]);
    return new RabbitConnectionManager(amqpConnectionManager, rabbitUrl!, logger);

}

const logger = new InstanceLogger();

const primaryConnection = getConnectionManager(configuration.rabbitHost.vhost?.toLowerCase()!);
DependencyInjectionContainer.bind<IRabbitConnectionManager>(TYPES.RabbitConnectionManager).toConstantValue(primaryConnection);
DependencyInjectionContainer.bind<SqlDbConnection>(TYPES.SqlDbConnection).to(SqlDbConnection).inSingletonScope();
DependencyInjectionContainer.bind<ActionExecutor>(TYPES.ActionExecutor).to(ActionExecutor).inSingletonScope();

// Device
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.DeviceRabbitConfig).toConstantValue(configuration.device.consume);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.DeviceConsumer).to(DeviceConsumer).inSingletonScope();
DependencyInjectionContainer.bind<ISnsClient>(TYPES.DeviceSnsClient).to(DeviceSnsClient).inSingletonScope();

// Alert
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.AlertRabbitConfig).toConstantValue(configuration.alert.consume);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.AlertConsumer).to(AlertConsumer).inSingletonScope();
DependencyInjectionContainer.bind<ISnsClient>(TYPES.AlertSnsClient).to(AlertSnsClient).inSingletonScope();

// Notification
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.NotificationRabbitConfig).toConstantValue(configuration.notification.consume);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.NotificationConsumer).to(NotificationConsumer).inSingletonScope();
DependencyInjectionContainer.bind<ISnsClient>(TYPES.NotificationSnsClient).to(NotificationSnsClient).inSingletonScope();

// Property
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.PropertyRabbitConfig).toConstantValue(configuration.property.consume);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.PropertyConsumer).to(PropertyConsumer).inSingletonScope();
DependencyInjectionContainer.bind<ISnsClient>(TYPES.PropertySnsClient).to(PropertySnsClient).inSingletonScope();

// Reading
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.ReadingRabbitConfig).toConstantValue(configuration.reading.consume);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.ReadingConsumer).to(ReadingConsumer).inSingletonScope();
DependencyInjectionContainer.bind<ISnsClient>(TYPES.ReadingSnsClient).to(ReadingSnsClient).inSingletonScope();

// Actions
const webhookDispatcher = new WebhookDispatcher(configuration, logger);
DependencyInjectionContainer.bind<ActionDispatcher>(TYPES.webhookDispatcher).toConstantValue(webhookDispatcher);

const snsDispatcher = new SnsDispatcher(configuration, logger);
DependencyInjectionContainer.bind<ActionDispatcher>(TYPES.snsDispatcher).toConstantValue(snsDispatcher);

const databaseDispatcher = new DatabaseDispatcher(configuration, logger);
DependencyInjectionContainer.bind<ActionDispatcher>(TYPES.databaseDispatcher).toConstantValue(databaseDispatcher);

// Logging
DependencyInjectionContainer.bind<ILogger>(TYPES.Logger).toConstantValue(logger);

if (!configuration.logging.suppressRemote) {
    const dataforwardConnection = getConnectionManager('dataforward');
    const rabbitPublisher = new RabbitPublisherService(configuration.rabbitHost, logger, dataforwardConnection);
    DependencyInjectionContainer.bind<IRabbitPublisherService>(TYPES.RabbitPublisher).toConstantValue(rabbitPublisher);
}

export { DependencyInjectionContainer };