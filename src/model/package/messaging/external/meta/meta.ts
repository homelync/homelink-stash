import { AlertOperationAction, DeviceOperationAction, NotificationOperationAction, PropertyOperationAction, ReadingOperationAction } from '../enums/action';

/**
* A contract that identifies an entities identity.
*
* #### Remarks
* All entities recieved will implement this contract.
* @category Contracts
*/
export interface MetaIdentityContract {
    /**
     * The unique identifier of an entity.
     *
     * #### Remarks
     * All entities will include an `__IDENTITY` field. This is intended to allow a consumer to
     * easily understand which field should be used as a unique domain key. The value contained within
     * `__IDENTITY` will also be present within the message under an entity specific field name e.g. `propertyId`, `deviceId`
     */
    __IDENTITY: string;
}

export type MetaMessageContract<T
    extends PropertyOperationAction
    | AlertOperationAction
    | DeviceOperationAction
    | ReadingOperationAction
    | NotificationOperationAction> = MetaActionContract<T> & MetaIdentityContract;

/**
 * A contract that supplies meta-data about the action context of a message
 *
 * #### Remarks
 * All top level messages will implement this contract.
 * @category Contracts
 */
export interface MetaActionContract<T
    extends PropertyOperationAction
    | AlertOperationAction
    | DeviceOperationAction
    | ReadingOperationAction
    | NotificationOperationAction> {
    /**
     * Specifies the action that generated a message.
     *
     * @type {OperationAction}
     */
    action: T;

    /**
     * The UTC time at which and action was performed.
     * #### Remarks
     * Is an ISO8601 formatted date string.
     * #### Example
        `2023-02-21T10:11:12.123Z`
     */
    actionTimestamp: string;
}