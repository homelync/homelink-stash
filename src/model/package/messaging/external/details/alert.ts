/**
 * @internal
 * @hidden
 */
export interface ExternalAlertResolutionDetail {
    resolvedDate?: string;
    resolvingEventId?: string;
    resolvingEventTypeId?: string;
    resolvingEventTypeName?: string;
    resolvingEventTypeDescription?: string;
}

/**
 * @internal
 * @hidden
 */
export interface ExternalAlertDetail  {
    title: string;
    description: string;
    statusId: string;
    category: string;
}