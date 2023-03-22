/**
 * Defines the model type of the device
 * (e.g. is it a fire alarm or a environment sensors?)
 * @enum {SourceModelType}
 * @category Enums
 */
export enum SourceModelType {
    /**
     * Environment Sensor - Carbon Dioxide only
     */
    CO2SENSOR = 'CO2SENSOR',
    /**
     * Virtual - Used against virtual devices used to sync outside weather readings
     */
    WEATHER = 'WEATHER',
    /**
     * Alarm - Carbon Monoxide
     */
    COALARM = 'COALARM',
    /**
     * Misc - Various accessories such as the Ei415
     */
    EIACCESSORY = 'EIACCESSORY',
    /**
     * Legacy - A deprecated modeltype for inhome electricitiy sensors.
     * #### Remarks
     * Has been superceded by `SMARTMETERGAS` and `SMARTMETERGASELEC`
     */
    ELECTRICITY = 'ELECTRICITY',
    /**
     * Environment Sensor - Temperature, Humidity & Carbon Dioxide
     */
    ENVCO2SENSOR = 'ENVCO2SENSOR',
    /**
     * Environment Sensor - Temperature & Humidity
     */
    ENVSENSOR = 'ENVSENSOR',
    /**
     * Alarm - Smoke or Heat
     */
    FIREALARM = 'FIREALARM',
    /**
     * Alarm - Smoke/Heat alarm and Carbon Monoxide
     */
    FIRECOALARM = 'FIRECOALARM',
    /**
     * Gateway - For IoT connectivtiy
     */
    GATEWAY = 'GATEWAY',
    /**
     * Smart Meter - Eletricity only
     */
    SMARTMETERELEC = 'SMARTMETERELEC',
    /**
     * Smart Meter - Gas only
     */
    SMARTMETERGAS = 'SMARTMETERGAS',
    /**
     * Smart Meter - Eletricity & Gas
     */
    SMARTMETERGASELEC = 'SMARTMETERGASELEC',
}