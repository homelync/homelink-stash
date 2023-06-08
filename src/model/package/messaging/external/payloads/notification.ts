
import { ExtendedExternalNotificationDetail, ExternalNotificationDetail } from '../details/notification';
import { NotificationOperationAction } from '../enums/action';
import { MetaIdentityContract, MetaMessageContract } from '../meta/meta';
import { ExternalAlertPayloadBase } from './alert';

export type ExternalNotificationAlertPayload = ExternalAlertPayloadBase
    & MetaIdentityContract;

export type ExternalNotificationPayload = ExtendedExternalNotificationDetail
    & ExternalNotificationDetail
    & MetaMessageContract<NotificationOperationAction>;