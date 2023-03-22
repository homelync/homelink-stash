/**
 * @internal
 * @hidden
 */
export interface ExternalDeviceDetail {
    deviceId: string;
    location: string;
    deviceSerialNumber: string;
    devicePhySerialNumber: string;
    manufacturerReference: string;
    sourceModel: string;
    sourceModelType: string;
    locationNickname: string | null;
    room: string;
}

/**
 * @internal
 * @hidden
 */
export interface ExtendedExternalDeviceDetail {
    installationDate: string;
    replaceByDate: string;
    installedBy: string;
    uninstallationDate: string | null;
}
