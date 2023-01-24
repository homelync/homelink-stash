
export interface MqttDevice {
    // Ownership
    landlordReference: string;
    propertyReference: string;
    propertyDisplayReference: string;

    // Device details
    virtualId: string;
    serialNumber: string;
    name: string;
    location: string;
    locationNickname?: string;
    model: string;
    status: string;
    type: string;
    installationDate: string;
    replaceByDate: string;
    installedBy: string;

    // Meta
    action: 'ADD' | 'UPDATE' | 'DELETE';
    actionTimestamp: string;

    // Address
    address1: string;
    address2?: string;
    city: string;
    postcode: string;
    country: string;
    adddressConfidence: string;
}
