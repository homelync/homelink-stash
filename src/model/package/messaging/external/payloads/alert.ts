import { ExternalAlertDetail, ExternalAlertResolutionDetail } from '../details/alert';
import { ExternalEventDetail, ExternalEventIdentityDetail } from '../details/event';
import { AlertOperationAction } from '../enums/action';
import { MetaMessageContract } from '../meta/meta';
import { NullableOptional } from '../strictTypes';
import { ExternalEventPayload } from './event';

export type ExternalAlertPayloadBase = ExternalEventPayload
    & ExternalEventDetail
    & ExternalEventIdentityDetail
    & ExternalAlertDetail
    & NullableOptional<ExternalAlertResolutionDetail>;

export type ExternalAlertPayload = ExternalAlertPayloadBase
    & MetaMessageContract<AlertOperationAction>;
