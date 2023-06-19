import { EntityType } from "homelink-stash-sdk";

export enum DatafeedForwardRecordId {
    property = 1,
    device = 2,
    alert = 3,
    notification = 4,
    reading = 5
}

export function getDatafeedForwardRecordId(entityType: EntityType): number {
    return DatafeedForwardRecordId[entityType];
}

export enum ActionResultCode {
    success = 2000,
    failure = 5000
}