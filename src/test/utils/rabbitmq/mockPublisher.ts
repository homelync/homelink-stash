
import { RabbitPublishConfig } from 'homelink-stash-sdk/config/rabbitConfig';
import { IRabbitPublisherService } from 'homelink-stash-sdk/services/rabbitmq/rabbitPublisherService';
import { DataForwardResult, ILogger } from 'homelink-stash-sdk/types/logging';

export class MockRabbitPublisherService implements IRabbitPublisherService {
    public async publish(message: DataForwardResult, publishConfig: RabbitPublishConfig){
    }
}