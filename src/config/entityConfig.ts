import { HookConfig } from './hookConfig';
import { RabbitConsumeConfig } from './rabbitConfig';
import { SnsConfig } from './snsConfig';

export interface EntityConfig {
    consume: RabbitConsumeConfig;
    actionType?: string;
    sns: SnsConfig;
    hook: HookConfig;
    usesDb: boolean;
    usesSns: boolean;
    usesHook: boolean;
}