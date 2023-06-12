import { expect } from 'chai';
import { TestHttpServer } from '../utils/webhooks/testServer';
import { ActionExecutor } from '../../actions/actionExecutor';
import 'reflect-metadata';

describe(`Action Executor`, () => {

    describe(`Webhook`, () => {
        const port = 5005;
        const webServer = new TestHttpServer('none', port, 'admin', 'supersecret');
        webServer.start();

        const config = {
            device: {
                actionType: 'webhook',
                hook: {
                    authenticationMethod: 'none',
                    endpoint: `http://localhost:5005/webhook`,
                    method: 'POST',
                    successCodes: [200],
                    username: '',
                    password: ''
                }
            }
        };

        it(`Should successfully POST`, async () => {
            webServer.clearLogs();
            const executor = new ActionExecutor();
            await executor.execute(config as any, 'device', { test: 'data' });

            expect(webServer.webHookLog.length).to.eql(1);
            expect(webServer.webHookLog[0].payload).to.eql({ test: 'data' });
            expect(webServer.webHookLog[0].method).to.eql('post');
        });
    });
});