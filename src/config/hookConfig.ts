import { AuthenticationType } from "./settings";

export interface HookConfig {
    endpoint: string;
    authenticationMethod: AuthenticationType;
    successCodes: number[];
    method: string;
    username: string;
    password: string;
}
