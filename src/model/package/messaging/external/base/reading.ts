import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsISO8601 } from 'class-validator';
import { ReadingOperationAction } from '../enums/action';

export abstract class AbstractReadingBase {
    /** {@inheritDoc MetaIdentityContract.__IDENTITY} */
    @Expose()
    @IsNotEmpty()
    public __IDENTITY!: string;

    /**
    * The date/time when a reading was collected/received.
    *
    * see: {@link DataTypeDescriptions.dateTime | 'DataTypeDescriptions.dateTime'}
    * */
    @Expose()
    @IsISO8601()
    @IsNotEmpty()
    public collectionDate!: string;

    /** {@inheritDoc MetaActionContract.action} */
    @Expose()
    @IsNotEmpty()
    public action!: ReadingOperationAction;

    /** {@inheritDoc MetaActionContract.actionTimestamp} */
    @Expose()
    @IsNotEmpty()
    public actionTimestamp!: string;

    /** {@inheritDoc DeviceFields.deviceId} */
    @Expose()
    @IsUUID('all')
    @IsNotEmpty()
    public deviceId!: string;

    //** {@inheritDoc DeviceFields.phySerialNumber} */
    @Expose()
    @IsNotEmpty()
    public devicePhySerialNumber!: string;

    //** {@inheritDoc DeviceFields.serialNumber} */
    @Expose()
    @IsNotEmpty()
    public deviceSerialNumber!: string;

    // CONTEXT
    /** {@inheritDoc CommonFields.landlordReference}    */
    @Expose()
    @IsNotEmpty()
    public landlordReference!: string;

    /** {@inheritDoc CommonFields.location} */
    @Expose()
    @IsNotEmpty()
    public location!: string;

    /** {@inheritDoc DeviceFields.locationNickname} */
    @Expose()
    public locationNickname!: string | null;

    /** {@inheritDoc DeviceFields.manufacturerReference} */
    @Expose()
    @IsNotEmpty()
    public manufacturerReference!: string;

    /** {@inheritDoc PropertyFields.propertyDisplayReference} */
    @Expose()
    @IsNotEmpty()
    public propertyDisplayReference!: string;

    /** {@inheritDoc PropertyFields.propertyId} */
    @Expose()
    @IsUUID('all')
    @IsNotEmpty()
    public propertyId!: string;

    /** {@inheritDoc PropertyFields.propertyReference} */
    @Expose()
    @IsNotEmpty()
    public propertyReference!: string;

    /**
    * The date/time when a reading was taken.
    *
    * see: {@link DataTypeDescriptions.dateTime | 'DataTypeDescriptions.dateTime'}
    * */
    @Expose()
    @IsNotEmpty()
    public readingDate!: string;

    /** {@inheritDoc ReadingType} */
    @Expose()
    @IsNotEmpty()
    public readingTypeId!: string;

    /** {@inheritDoc CommonFields.room} */
    @Expose()
    @IsNotEmpty()
    public room!: string;

    /** {@inheritDoc DeviceFields.sourceModel} */
    @Expose()
    @IsNotEmpty()
    public sourceModel!: string;

    /** {@inheritDoc DeviceFields.sourceModelType} */
    @Expose()
    @IsNotEmpty()
    public sourceModelType!: string;

    /** {@inheritDoc ReadingUnit} */
    @Expose()
    @IsNotEmpty()
    public unit!: string;

    /**
    * A floating point numeric value with up-to 4 places of precision, representing the value of the reading in units of
    * see: {@link HomelinkReading.unit | 'HomelinkReading.unit'}
    * #### Example
    * - `Temperature`: `23.7800`
    * - `Humidity`: `86.1200`
    * - `CO2`: `2612.00000`
    */
    @Expose()
    @IsNotEmpty()
    public value!: number;
}