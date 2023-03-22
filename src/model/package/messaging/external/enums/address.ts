/**
 * Represents the confidence HomeLINK has that an address is correct.
 * Confidence is based on our ability to succesfully geo-code the address.
 *
 * @enum {AddressConfidence}
 * @category Enums
 */
export enum AddressConfidence {
    /**
     * High level of confidence based on a successful geo-code using the full address.
     */
    FULL = 'FULL',
    /**
     * Medium level of confidence based on a successful geo-code using only the postcode.
     */
    PARTIAL = 'PARTIAL',
    /**
     * Low level of confidence based on an unsuccessful attempted geo-code.
     */
    NONE = 'NONE'
}