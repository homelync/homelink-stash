export interface RabbitConsumeConfig {
    queue: string;
    deadLetterExchange: string;
    maxRetry?: number;
    failedRoutingKey?: string;
    prefetch?: number;
    enabled: boolean;
}

export interface RabbitHostConfig {
    host?: string;
    port: number;
    vhost?: string;
    username?: string;
    password?: string;
    tls?: boolean;
    publishTimeoutMs: number;
}

export interface EntityConfig {
    consume: RabbitConsumeConfig;
    actionType?: string;
    sns: SnsConfig;
    hook: HookConfig;
    usesDb: boolean;
    usesSns: boolean;
    usesHook: boolean;
}

export interface SnsConfig {
    clientId: string;
    clientSecret: string;
    topic: string;
}

export interface HookConfig {
    url: string;
}