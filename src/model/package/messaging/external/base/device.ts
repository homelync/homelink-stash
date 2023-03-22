import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID, IsISO8601, ValidateIf } from 'class-validator';
import { DeviceOperationAction } from '../enums/action';
import { SourceModelType } from '../enums/models';

export abstract class AbstractDeviceBase {

    /** {@inheritDoc MetaIdentityContract.__IDENTITY} */
    @Expose()
    @IsNotEmpty()
    public __IDENTITY!: string;

    /** {@inheritDoc MetaActionContract.action} */
    @Expose()
    @IsNotEmpty()
    public action!: DeviceOperationAction;

    /** {@inheritDoc MetaActionContract.actionTimestamp} */
    @Expose()
    @IsNotEmpty()
    @IsISO8601()
    public actionTimestamp!: string;

    // Address
    /** {@inheritDoc AddressFields.address1} */
    @Expose()
    @IsNotEmpty()
    public address1!: string;

    /** {@inheritDoc AddressFields.address2} */
    @Expose()
    public address2!: string | null;

    /** {@inheritDoc AddressFields.addressConfidence}*/
    @Expose()
    @IsNotEmpty()
    public addressConfidence!: string;

    /** {@inheritDoc AddressFields.city} */
    @Expose()
    @IsNotEmpty()
    public city!: string;

    /** {@inheritDoc AddressFields.country} */
    @Expose()
    @IsNotEmpty()
    public country!: string;

    /** {@inheritDoc DeviceFields.deviceId} */
    @Expose()
    @IsUUID('all')
    @IsNotEmpty()
    public deviceId!: string;

    /** {@inheritDoc DeviceFields.physicalSerialNumber} */
    @Expose()
    @IsNotEmpty()
    public devicePhySerialNumber!: string;

    /** {@inheritDoc DeviceFields.deviceSerialNumber} */
    @Expose()
    @IsNotEmpty()
    public deviceSerialNumber!: string;

    /**
     * The date/time denoting when a device was installed.
     *
     * see: {@link DataTypeDescriptions.dateTime | 'DataTypeDescriptions.dateTime'}
     * */
    @Expose()
    @IsNotEmpty()
    @IsISO8601()
    public installationDate!: string;

    /** {@inheritDoc DeviceFields.installedBy} */
    @Expose()
    @IsNotEmpty()
    public installedBy!: string;

    /** {@inheritDoc CommonFields.landlordReference} */
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

    /** {@inheritDoc AddressFields.postcode} */
    @Expose()
    @IsNotEmpty()
    public postcode!: string;

    /** {@inheritDoc PropertyFields.propertyDisplayReference} */
    @Expose()
    @IsNotEmpty()
    public propertyDisplayReference!: string;

    /** {@inheritDoc PropertyFields.propertyId}  */
    @Expose()
    @IsNotEmpty()
    public propertyId!: string;

    /** {@inheritDoc PropertyFields.propertyReference} */
    @Expose()
    @IsNotEmpty()
    public propertyReference!: string;

    /**
    * The date/time denoting when a device needs replacing.
    *
    * see: {@link DataTypeDescriptions.dateTime | 'DataTypeDescriptions.dateTime'}
    * */
    @Expose()
    @IsNotEmpty()
    @IsISO8601()
    public replaceByDate!: string;

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
    public sourceModelType!: SourceModelType;

    /**
     * The date/time denoting when a device was uninstalled. `nullable`
     *
     * see: {@link DataTypeDescriptions.dateTime | 'DataTypeDescriptions.dateTime'}
     * */
    @Expose()
    @ValidateIf(x => x.action === DeviceOperationAction.REMOVE)
    @IsISO8601()
    public uninstallationDate!: string | null;

    /**
      * @internal
      * @hidden
      */
    public validate(): string[] {
        const validationMessages: string[] = [];
        if (this.__IDENTITY !== this.deviceId) {
            validationMessages.push('__IDENTITY must be equal to deviceId'); validationMessages.push();
        }
        return validationMessages;
    }
}