import { Expose } from 'class-transformer';

import { IsNotEmpty, IsISO8601, ValidateIf, IsUUID } from 'class-validator';

// TODO: add missing docs
// Note: this is conceptually an abstract class but due to some validation stuff, it cannot be marked as abstract.
export class AbstractEventBase  {
    @IsNotEmpty()
    @Expose()
    public description!: string;

      /** {@inheritDoc DeviceFields.deviceId} */
    @ValidateIf(x => !x.deviceId && !x.insightId)
    @IsUUID('all')
    @IsNotEmpty({ message: 'either deviceId or insightId must be supplied' })
    @Expose()
    public deviceId!: string | null;

    /** {@inheritDoc DeviceFields.devicePhySerialNumber} */
    @ValidateIf(x => x.deviceId)
    @IsNotEmpty()
    @Expose()
    public devicePhySerialNumber!: string | null;

    /** {@inheritDoc DeviceFields.deviceSerialNumber} */
    @ValidateIf(x => x.deviceId)
    @IsNotEmpty()
    @Expose()
    public deviceSerialNumber!: string | null;

    // Event Type
    /**
     * The unique identifier of the `EventType` that created this `Alert`.
     * #### Remarks
     * Is an enum/lookup with many values and is not captured in this type-doc. See reference for below for more details list not captured in this type-doc.
     * #### References:
     * - [Frontier Lookup API Docs](https://frontier.live.homelync.io/api-docs/#/lookup/Get)
     * - GET https://frontier.live.homelync.io/v1/lookup/eventType(requires authentication)
     * - https://help.live.homelync.io/hc/en-us/articles/7036511602577-Event-Types
     */
    @IsNotEmpty()
    @Expose()
    public eventTypeId!: string;

    /**
     * A friendly name for {@link HomelinkNotificationAlert.eventTypeId | eventTypeId}
     *
     */
    @IsNotEmpty()
    @Expose()
    public eventTypeName!: string;

    @ValidateIf(x => x.insightId)
    @IsNotEmpty()
    @Expose()
    public insightDefinitionId!: string | null;

    // Insight
    @ValidateIf(x => !x.deviceId && !x.insightId)
    @IsUUID('all')
    @IsNotEmpty({ message: 'either deviceId or insightId must be supplied' })
    @Expose()
    public insightId!: string | null;

    // context
    // landlord
    /** {@inheritDoc CommonFields.landlordReference} */
    @Expose()
    @IsNotEmpty()
    public landlordReference!: string;

    /** {@inheritDoc CommonFields.location} */
    @ValidateIf(x => x.deviceId)
    @IsNotEmpty()
    @Expose()
    public location!: string | null;

    /** {@inheritDoc DeviceFields.locationNickname} */
    @Expose()
    public locationNickname!: string | null;

    /**
    * Defines the manufacturer of the device. `nullable` - if event is against an insight.
    * #### Example
    * - `EI`
    */
    @ValidateIf(x => x.deviceId)
    @IsNotEmpty()
    @Expose()
    public manufacturerReference!: string | null;

    /** {@inheritDoc PropertyFields.propertyDisplayReference} */
    @Expose()
    @IsNotEmpty()
    public propertyDisplayReference!: string;

    /** {@inheritDoc PropertyFields.propertyId}    */
    @Expose()
    @IsNotEmpty()
    public propertyId!: string;

    /** {@inheritDoc PropertyFields.propertyReference} */
    @Expose()
    @IsNotEmpty()
    public propertyReference!: string;

    // Event
    @IsNotEmpty()
    @IsISO8601()
    @Expose()
    public raisedDate!: string;

    /** {@inheritDoc CommonFields.room} */
    @ValidateIf(x => x.deviceId)
    @IsNotEmpty()
    @Expose()
    public room!: string | null;

    @Expose()
    public severity!: string;

    @Expose()
    @IsNotEmpty()
    public sourceId!: string;

    /** {@inheritDoc DeviceFields.sourceModel} */
    @IsNotEmpty()
    @Expose()
    public sourceModel!: string;

    /** {@inheritDoc DeviceFields.sourceModelType} */
    @IsNotEmpty()
    @Expose()
    public sourceModelType!: string;

    @IsNotEmpty()
    @Expose()
    public title!: string;

}