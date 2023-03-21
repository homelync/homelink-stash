import { injectable, unmanaged } from "inversify";
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { configuration } from "../../config/config";


export interface ISnsClient {
    publish(topic: string, message: any);
}

@injectable()
export abstract class SnsClient implements ISnsClient {

    private awsSnsClient: SNSClient;

    constructor(@unmanaged() clientId?: string, @unmanaged() clientSecret?: string) {
        if (clientId && clientSecret) {
            this.awsSnsClient = new SNSClient({ region: 'eu-west-2', credentials: { accessKeyId: clientId, secretAccessKey: clientSecret } });
        } else {
            this.awsSnsClient = new SNSClient({ region: 'eu-west-2' });
        }
    }

    public async publish(topic: string, message: any) {

        const params = {
            Message: JSON.stringify(message),
            TopicArn: topic
        };

        const command = new PublishCommand(params);
        await this.awsSnsClient.send(command);
    }
}

@injectable()
export class AlertSnsClient extends SnsClient {
    constructor(){
        super(configuration.alert.sns.clientId, configuration.alert.sns.clientSecret);
    }
}

@injectable()
export class DeviceSnsClient extends SnsClient {
    constructor() {
        super(configuration.device.sns.clientId, configuration.device.sns.clientSecret);
    }
}

@injectable()
export class PropertySnsClient extends SnsClient {
    constructor() {
        super(configuration.property.sns.clientId, configuration.property.sns.clientSecret);
    }
}

@injectable()
export class NotificationSnsClient extends SnsClient {
    constructor() {
        super(configuration.notification.sns.clientId, configuration.notification.sns.clientSecret);
    }
}

@injectable()
export class ReadingSnsClient extends SnsClient {
    constructor() {
        super(configuration.reading.sns.clientId, configuration.reading.sns.clientSecret);
    }
}