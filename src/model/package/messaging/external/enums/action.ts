/**
 * Represents the actions that has been taken against a HomeLINK entity.
 *
 * @enum {OperationAction}
 * @category Enums
 * @internal
 */
export enum OperationAction {
    /**
     * An entity has been added.
     */
    ADD = 'ADD',
    /**
     * An entity has been updated.
     */
    UPDATE = 'UPDATE',
    /**
     * An entity has been removed/uninstalled
     */
    REMOVE = 'REMOVE',
    /**
     * A previously active entity has been resolved.
     */
    RESOLVE = 'RESOLVE',
    /**
     * A notification has been sent.
     */
    SEND = 'SEND'
}

/**
 * Represents the actions that can be taken against a {@link HomelinkDevice | 'Device'}.
 *
 * see: {@link OperationAction | 'OperationActions'}
 *
 * @enum {DeviceOperationAction}
 * @category Enums
 */
export enum DeviceOperationAction {
    /**
     * A {@link HomelinkDevice | 'Device'} has been installed
     */
    ADD = 'ADD',
    /**
     * A {@link HomelinkDevice | 'Device'} has been updated, e.g. it has been given a nickname.
     */
    UPDATE = 'UPDATE',
    /**
     * An {@link HomelinkDevice | 'Device'} has been removed/uninstalled
     */
    REMOVE = 'REMOVE'
}

/**
 * Represents the actions that can be taken against a {@link HomelinkProperty | 'Property'}.
 *
 * see: {@link OperationAction | 'OperationActions'}
 *
 * @enum {PropertyOperationAction}
 * @category Enums
 */
export enum PropertyOperationAction {
    /**
     * A {@link HomelinkProperty | 'Property'} has been installed
     */
    ADD = 'ADD',
    /**
     * A {@link HomelinkProperty | 'Property'} has been updated, e.g. it has had a Device added
     */
    UPDATE = 'UPDATE',
    /**
     * An {@link HomelinkProperty | 'Property'} has been removed/uninstalled
     */
    REMOVE = 'REMOVE'
}

/**
 * Represents the actions that can be taken against a {@link HomelinkNotification | 'Notification'}.
 *
 * see: {@link OperationAction | 'OperationActions'}
 *
 * @enum {NotificationOperationAction}
 * @category Enums
 */
export enum NotificationOperationAction {
    /**
     * A {@link HomelinkNotification | 'Notification'} has been sent.
     */
    SEND = 'SEND'
}

/**
 * Represents the actions that can be taken against an `{@link HomelinkAlert | 'Alert'}`.
 *
 * see: {@link OperationAction | 'OperationActions'}
 *
 * @enum {AlertOperationAction}
 * @category Enums
 */
export enum AlertOperationAction {
    /**
     * An active {@link HomelinkAlert | 'Alert'} has been raised.
     */
    ADD = 'ADD',
    /**
    * A previously active {@link HomelinkAlert | 'Alert'} has been resolved.
    */
    RESOLVE = 'RESOLVE'
}

/**
 * Represents the actions that can be taken against an {@link HomelinkReading | 'Reading'}`.
 *
 * see: {@link OperationAction | 'OperationActions'}
 *
 * @enum {ReadingOperationAction}
 * @category Enums
 */
export enum ReadingOperationAction {
    /**
     * A {@link HomelinkReading | 'Reading'} has been taken.
     */
    ADD = 'ADD'
}