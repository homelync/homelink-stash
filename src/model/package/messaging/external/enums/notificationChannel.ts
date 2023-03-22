/**
* Enumerates the channels by which a notification can be sent.
* #### References:
* - [Frontier Lookup API Docs](https://frontier.live.homelync.io/api-docs/#/lookup/Get)
* - GET https://frontier.live.homelync.io/v1/lookup/distrbutionChannels (requires authentication)
* @category Enums
*/
export enum NotificationChannel {
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    WEB = 'WEB',
    NATIVE = 'NATIVE'
}
