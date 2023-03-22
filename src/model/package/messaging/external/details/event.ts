/**
 * @internal
 * @hidden
 */
export interface ExternalEventTypeDetail {
    eventTypeId: string;
    eventTypeName: string;
    severity: string;
}

/**
 * @internal
 * @hidden
 */
export interface ExternalEventDetail {
    raisedDate: string;
    title: string;
    description: string;
    sourceId: string;
}

/**
 * @internal
 * @hidden
 */
export interface ExternalEventIdentityDetail {
    eventId: string;
}