import { Expose } from 'class-transformer';

import { IsNotEmpty, IsUUID, IsEnum, ValidateIf } from 'class-validator';

import { AlertCategory } from '../enums/alertCategory';

import { AlertStatus } from '../enums/alertStatus';

import { AbstractEventBase } from './event';

// Note: this is conceptually an abstract class but due to some validation stuff, it cannot be marked as abstract.
export class AbstractAlertBase extends AbstractEventBase {
    @Expose()
    @IsEnum(AlertCategory)
    @IsNotEmpty()
    public category!: string;

    /**
     * The unique identifier for the `Event` that caused this `Alert` to be raised
     *
     * ### Example
     * `dbaff3d3-c378-11ed-85b0-02ebbba20758`
     */
    @Expose()
    @IsNotEmpty()
    @IsUUID('all')
    public eventId!: string;

    /**
     * The date/time denoting when an `Alert` was resolved. `nullable`.
     *
     * see: {@link DataTypeDescriptions.dateTime | 'DataTypeDescriptions.dateTime'}
     * */
    @Expose()
    @ValidateIf(x => x.statusId && x.statusId.toLowerCase() === 'resolved')
    @IsNotEmpty()
    public resolvedDate!: string | null;

    /**
     * The unique identifier of the `Event` that resolved this `Alert`
     *
     */
    @Expose()
    @ValidateIf(x => x.statusId && x.statusId.toLowerCase() === 'resolved')
    @IsNotEmpty()
    public resolvingEventId!: string | null;

    /**
     * A description of the `EventType` that resolved this `Alert`. `nullable`.
     *
     */
    @Expose()
    @ValidateIf(x => x.statusId && x.statusId.toLowerCase() === 'resolved')
    @IsNotEmpty()
    public resolvingEventTypeDescription!: string | null;

    /**
     * The unique identifier of the `EventType` that resolved this `Alert`. `nullable`.
     *
     */
    @Expose()
    @ValidateIf(x => x.statusId && x.statusId.toLowerCase() === 'resolved')
    @IsNotEmpty()
    public resolvingEventTypeId!: string | null;

    /**
     * The friendly name of the `EventType` that resolved this `Alert`. `nullable`.
     *
     */
    @Expose()
    @ValidateIf(x => x.statusId && x.statusId.toLowerCase() === 'resolved')
    @IsNotEmpty()
    public resolvingEventTypeName!: string | null;

    @Expose()
    @IsEnum(AlertStatus)
    @IsNotEmpty()
    public statusId!: string;
}