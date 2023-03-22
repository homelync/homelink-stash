
/**
 * @internal
 * @hidden
 */
export interface ExternalPropertyDetail {
    landlordReference: string;
    propertyId: string;
    propertyReference: string;
    propertyDisplayReference: string;
}

/**
 * @internal
 * @hidden
 */
export interface ExternalAddressDetail {
    address1: string;
    address2: string | null;
    city: string;
    postcode: string;
    country: string;
    addressConfidence: string;
}

// Ownership
export interface ExtendedExternalPropertyDetail {
    deviceCount: number;
    installedBy: string;
}