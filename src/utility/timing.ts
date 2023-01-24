
import { EventCode } from "../model/eventCode";
import { Logger } from "../utility/logger";


export class Timing {
    public startTime: Date;
    public endTime!: Date;
    public duration: number = 0;
    constructor(public metricName) {
        this.startTime = new Date();
    }

    public stop(eventId?: EventCode, method?: string, context?: string) {
        this.endTime = new Date();
        const startTimeEpoch = this.startTime.getTime();
        const endTimeEpoch = this.endTime.getTime();
        this.duration = endTimeEpoch - startTimeEpoch;

        Logger.timing(this.metricName, this.duration, eventId, context, method);
    }
}