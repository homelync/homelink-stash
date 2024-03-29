import { injectable, unmanaged } from 'inversify';
import { PublishCommand, PublishResponse, SNSClient } from '@aws-sdk/client-sns';
import { configuration } from '../../config/config';

export interface ISnsClient {
    publish(topic: string, message: any);
}

@injectable()
export abstract class SnsClient implements ISnsClient {

    private awsSnsClient: SNSClient;

    constructor(@unmanaged() clientId?: string, @unmanaged() clientSecret?: string) {
        const region = configuration.awsRegion;

        if (clientId && clientSecret) {
            this.awsSnsClient = new SNSClient({ region: region, credentials: { accessKeyId: clientId, secretAccessKey: clientSecret } });
        } else {
            this.awsSnsClient = new SNSClient({ region: region });
        }
    }

    public async publish(topic: string, message: any): Promise<PublishResponse> {

        const params = {
            Message: JSON.stringify(message),
            TopicArn: topic
        };

        const command = new PublishCommand(params);
        return await this.awsSnsClient.send(command);
    }
}

@injectable()
export class AlertSnsClient extends SnsClient {
    constructor() {
        super(configuration.alert.sns.clientId, configuration.alert.sns.secret);
    }
}

@injectable()
export class DeviceSnsClient extends SnsClient {
    constructor() {
        super(configuration.device.sns.clientId, configuration.device.sns.secret);
    }
}

@injectable()
export class PropertySnsClient extends SnsClient {
    constructor() {
        super(configuration.property.sns.clientId, configuration.property.sns.secret);
    }
}

@injectable()
export class NotificationSnsClient extends SnsClient {
    constructor() {
        super(configuration.notification.sns.clientId, configuration.notification.sns.secret);
    }
}

@injectable()
export class ReadingSnsClient extends SnsClient {
    constructor() {
        super(configuration.reading.sns.clientId, configuration.reading.sns.secret);
    }
}