export const TYPES = {
    SqlDbConnection: Symbol('SqlDbConnection'),
    RabbitConnectionManager: Symbol('RabbitConnectionManager'),

    // Device
    DeviceRabbitConfig: Symbol('DeviceRabbitConfig'),
    DeviceClient: Symbol('DeviceClient'),
    DeviceConsumer: Symbol('DeviceConsumer'),
    DeviceSnsClient: Symbol('DeviceSnsClient'),

    // Alert
    AlertRabbitConfig: Symbol('AlertRabbitConfig'),
    AlertClient: Symbol('AlertClient'),
    AlertConsumer: Symbol('AlertConsumer'),
    AlertSnsClient: Symbol('AlertSnsClient')
};