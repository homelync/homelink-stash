export const TYPES = {
    SqlDbConnection: Symbol('SqlDbConnection'),
    RabbitConnectionManager: Symbol('RabbitConnectionManager'),
    ActionExecutor: Symbol('ActionExecutor'),

    // Device
    DeviceRabbitConfig: Symbol('DeviceRabbitConfig'),
    DeviceClient: Symbol('DeviceClient'),
    DeviceConsumer: Symbol('DeviceConsumer'),
    DeviceSnsClient: Symbol('DeviceSnsClient'),

    // Alert
    AlertRabbitConfig: Symbol('AlertRabbitConfig'),
    AlertClient: Symbol('AlertClient'),
    AlertConsumer: Symbol('AlertConsumer'),
    AlertSnsClient: Symbol('AlertSnsClient'),

    // Property
    PropertyRabbitConfig: Symbol('PropertyRabbitConfig'),
    PropertyClient: Symbol('PropertyClient'),
    PropertyConsumer: Symbol('PropertyConsumer'),
    PropertySnsClient: Symbol('PropertySnsClient'),

    // Reading
    ReadingRabbitConfig: Symbol('ReadingRabbitConfig'),
    ReadingClient: Symbol('ReadingClient'),
    ReadingConsumer: Symbol('ReadingConsumer'),
    ReadingSnsClient: Symbol('ReadingSnsClient'),

    // Notification
    NotificationRabbitConfig: Symbol('NotificationRabbitConfig'),
    NotificationClient: Symbol('NotificationClient'),
    NotificationConsumer: Symbol('NotificationConsumer'),
    NotificationSnsClient: Symbol('NotificationSnsClient'),

    // Actions
    webhookDispatcher: Symbol('WebhookDispatcher'),
    snsDispatcher: Symbol('SnsDispatcher'),
    databaseDispatcher: Symbol('DatabaseDispatcher'),

    // Utility
    Logger: Symbol('Logger')
};