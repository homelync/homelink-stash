import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { PropertyOperationAction } from '../enums/action';

export abstract class AbstractPropertyBase {
    /** {@inheritDoc MetaIdentityContract.__IDENTITY} */
    @Expose()
    @IsNotEmpty()
    public __IDENTITY!: string;

    /** {@inheritDoc MetaActionContract.action} */
    @Expose()
    @IsNotEmpty()
    public action!: PropertyOperationAction;

    /** {@inheritDoc MetaActionContract.actionTimestamp} */
    @Expose()
    @IsNotEmpty()
    public actionTimestamp!: string;

    /** {@inheritDoc AddressFields.address1} */
    @Expose()
    @IsNotEmpty()
    public address1!: string;

    /** {@inheritDoc AddressFields.address2} */
    @Expose()
    public address2!: string | null;

    /** {@inheritDoc AddressFields.addressConfidence} */
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

    /** The number of devices installed at the property at the time this message was sent */
    @Expose()
    @IsNotEmpty()
    public deviceCount!: number;

    /** {@inheritDoc DeviceFields.installedBy} */
    @Expose()
    @IsNotEmpty()
    public installedBy!: string;

    /** {@inheritDoc CommonFields.landlordReference} */
    @Expose()
    @IsNotEmpty()
    public landlordReference!: string;

    /** {@inheritDoc AddressFields.postcode} */
    @Expose()
    @IsNotEmpty()
    public postcode!: string;

    /** {@inheritDoc PropertyFields.propertyDisplayReference} */
    @Expose()
    @IsNotEmpty()
    public propertyDisplayReference!: string;

    /** {@inheritDoc PropertyFields.propertyId} */
    @Expose()
    @IsNotEmpty()
    @IsUUID('all')
    public propertyId!: string;

    /** {@inheritDoc PropertyFields.propertyReference} */
    @Expose()
    @IsNotEmpty()
    public propertyReference!: string;
}