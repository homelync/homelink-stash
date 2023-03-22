
import { ExternalDeviceDetail, ExtendedExternalDeviceDetail } from '../details/device';
import { ExternalPropertyDetail, ExternalAddressDetail } from '../details/property';
import { DeviceOperationAction } from '../enums/action';
import { MetaMessageContract } from '../meta/meta';

/**
 * @internal
 * @hidden
 */
export type ExternalDevicePayload = ExternalDeviceDetail
    & ExternalPropertyDetail
    & ExternalAddressDetail
    & ExtendedExternalDeviceDetail
    & MetaMessageContract<DeviceOperationAction>;
