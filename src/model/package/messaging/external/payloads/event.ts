import { ExternalDeviceDetail } from '../details/device';
import { ExternalEventTypeDetail, ExternalEventDetail } from '../details/event';
import { ExternalPropertyDetail } from '../details/property';
import { Nullable } from '../strictTypes';
import { ExternalInsightDetail } from './insight';

export type ExternalEventPayloadBase = ExternalEventTypeDetail & ExternalPropertyDetail & ExternalEventDetail;
export type ExternalEventPayload = ExternalEventPayloadBase & Nullable<ExternalDeviceDetail> & Nullable<ExternalInsightDetail>;
