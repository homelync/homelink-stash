import { ExtendedExternalPropertyDetail, ExternalAddressDetail, ExternalPropertyDetail } from '../details/property';
import { PropertyOperationAction } from '../enums/action';
import { MetaMessageContract } from '../meta/meta';

export type ExternalPropertyPayload = ExternalPropertyDetail
    & ExtendedExternalPropertyDetail
    & ExternalAddressDetail
    & MetaMessageContract<PropertyOperationAction>;