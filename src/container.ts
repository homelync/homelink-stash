import { Container } from 'inversify';
import 'reflect-metadata';
import { connect as amqpConnect } from 'amqp-connection-manager';
import { RabbitConnectionManager, IRabbitConnectionManager } from './service/rabbitConnectionManager';
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
import { WebhookDispatcher, RabbitConsumeConfig } from 'homelinkstash-plugin-sdk';
import { Dispatcher as SnsDispatcher } from './actions/sns/dispatcher';
import { InstanceLogger } from './utility/logger';
import { ILogger } from 'homelinkstash-plugin-sdk';

let DependencyInjectionContainer = new Container();

const rabbitUrl = configuration.rabbitHost.port
    ? `${configuration.rabbitHost.host}:${configuration.rabbitHost.port}`
    : configuration.rabbitHost.host;

const protocol = configuration.rabbitHost.tls ? 'amqps://' : 'amqp://';
const connectionString = `${protocol}${configuration.rabbitHost.username}:${configuration.rabbitHost.password}@${rabbitUrl}/${configuration.rabbitHost.vhost?.toLowerCase()}`;
const amqpConnectionManager = amqpConnect([connectionString]);
const rabbitConnectionManager = new RabbitConnectionManager(amqpConnectionManager, rabbitUrl!);

DependencyInjectionContainer.bind<IRabbitConnectionManager>(TYPES.RabbitConnectionManager).toConstantValue(rabbitConnectionManager);
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
const webhookDispatcher = new WebhookDispatcher(configuration);
DependencyInjectionContainer.bind<ActionDispatcher>(TYPES.webhookDispatcher).toConstantValue(webhookDispatcher);

const snsDispatcher = new SnsDispatcher(configuration);
DependencyInjectionContainer.bind<ActionDispatcher>(TYPES.snsDispatcher).toConstantValue(snsDispatcher);

const databaseDispatcher = new SnsDispatcher(configuration);
DependencyInjectionContainer.bind<ActionDispatcher>(TYPES.databaseDispatcher).toConstantValue(databaseDispatcher);

// Utility
DependencyInjectionContainer.bind<ILogger>(TYPES.Logger).to(InstanceLogger).inSingletonScope();

export { DependencyInjectionContainer };