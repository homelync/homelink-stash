
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsEmail, ValidateIf, IsPhoneNumber, IsEnum } from 'class-validator';
import { NotificationChannel } from '../enums/notificationChannel';

export abstract class AbstractNotificationBase {

    // Ownership
    @Expose()
    @IsNotEmpty()
    public landlordReference!: string;

    @Expose()
    @IsNotEmpty()
    @IsEmail()
    public recipientEmail!: string;

    @Expose()
    @ValidateIf(x => x.channel === NotificationChannel.SMS)
    @IsPhoneNumber()
    public recipientSmsNumber!: string | null;

    @Expose()
    public recipientUsername!: string;

    @Expose()
    public recipientLandlordPersonReference!: string | null;

    @IsEnum(NotificationChannel)
    @IsNotEmpty()
    @Expose()
    public channel!: NotificationChannel;
}