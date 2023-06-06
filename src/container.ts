import { Container } from 'inversify';
import 'reflect-metadata';
import { connect as amqpConnect } from 'amqp-connection-manager';
import { RabbitConnectionManager, IRabbitConnectionManager } from './service/rabbitConnectionManager';
import { configuration } from './config/config';
import { TYPES } from './global/types';
import { RabbitConsumeConfig } from './config/rabbitConfig';
import { ServiceClient } from './client/serviceClient';
import { DeviceClient } from './client/deviceClient';
import { DeviceConsumer } from './deviceConsumer';
import { ConsumerBase } from './consumerBase';
import { SqlDbConnection } from './forward/db/sqlDbConnection';
import { AlertClient } from './client/alertClient';
import { AlertConsumer } from './alertConsumer';
import { AlertSnsClient, DeviceSnsClient, ISnsClient, NotificationSnsClient, PropertySnsClient, ReadingSnsClient } from './forward/sns/snsClient';
import { NotificationClient } from './client/notificationClient';
import { PropertyClient } from './client/propertyClient';
import { ReadingClient } from './client/readingClient';
import { NotificationConsumer } from './notificationConsumer';
import { PropertyConsumer } from './propertyConsumer';
import { ReadingConsumer } from './readingConsumer';

let DependencyInjectionContainer = new Container();

// Homelync Rabbit Connection
const rabbitUrl = configuration.rabbitHost.port
    ? `${configuration.rabbitHost.host}:${configuration.rabbitHost.port}`
    : configuration.rabbitHost.host;

const protocol = configuration.rabbitHost.tls ? 'amqps://' : 'amqp://';
const connectionString = `${protocol}${configuration.rabbitHost.username}:${configuration.rabbitHost.password}@${rabbitUrl}/${configuration.rabbitHost.vhost?.toLowerCase()}`
console.log(`Connecting to RabbitMQ at ${connectionString}`);
const amqpConnectionManager = amqpConnect([connectionString]);
const rabbitConnectionManager = new RabbitConnectionManager(amqpConnectionManager, rabbitUrl!);

DependencyInjectionContainer.bind<SqlDbConnection>(TYPES.SqlDbConnection).to(SqlDbConnection);

DependencyInjectionContainer.bind<IRabbitConnectionManager>(TYPES.RabbitConnectionManager).toConstantValue(rabbitConnectionManager);

// Device
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.DeviceRabbitConfig).toConstantValue(configuration.device.consume);
DependencyInjectionContainer.bind<ServiceClient>(TYPES.DeviceClient).to(DeviceClient);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.DeviceConsumer).to(DeviceConsumer);
DependencyInjectionContainer.bind<ISnsClient>(TYPES.DeviceSnsClient).to(DeviceSnsClient);

// Alert
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.AlertRabbitConfig).toConstantValue(configuration.alert.consume);
DependencyInjectionContainer.bind<ServiceClient>(TYPES.AlertClient).to(AlertClient);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.AlertConsumer).to(AlertConsumer);
DependencyInjectionContainer.bind<ISnsClient>(TYPES.AlertSnsClient).to(AlertSnsClient);

// Notification
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.NotificationRabbitConfig).toConstantValue(configuration.notification.consume);
DependencyInjectionContainer.bind<ServiceClient>(TYPES.NotificationClient).to(NotificationClient);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.NotificationConsumer).to(NotificationConsumer);
DependencyInjectionContainer.bind<ISnsClient>(TYPES.NotificationSnsClient).to(NotificationSnsClient);

// Property
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.PropertyRabbitConfig).toConstantValue(configuration.property.consume);
DependencyInjectionContainer.bind<ServiceClient>(TYPES.PropertyClient).to(PropertyClient);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.PropertyConsumer).to(PropertyConsumer);
DependencyInjectionContainer.bind<ISnsClient>(TYPES.PropertySnsClient).to(PropertySnsClient);

// Reading
DependencyInjectionContainer.bind<RabbitConsumeConfig>(TYPES.ReadingRabbitConfig).toConstantValue(configuration.reading.consume);
DependencyInjectionContainer.bind<ServiceClient>(TYPES.ReadingClient).to(ReadingClient);
DependencyInjectionContainer.bind<ConsumerBase>(TYPES.ReadingConsumer).to(ReadingConsumer);
DependencyInjectionContainer.bind<ISnsClient>(TYPES.ReadingSnsClient).to(ReadingSnsClient);

export { DependencyInjectionContainer };