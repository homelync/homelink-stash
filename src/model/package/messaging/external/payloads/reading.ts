import { ExternalReadingDetail } from '../details/reading';
import { ReadingOperationAction } from '../enums/action';
import { MetaMessageContract } from '../meta/meta';

export type ExternalReadingPayload = ExternalReadingDetail
    & MetaMessageContract<ReadingOperationAction>;