import { expect } from 'chai';
import { WebhookDispatcher as Dispatcher } from 'homelink-stash-sdk';
import { TestHttpServer } from '../utils/webhooks/testServer';

describe(`Webhook Dispatcher`, () => {

    describe(`No Auth`, () => {
        const port = 4999;
        const webServer = new TestHttpServer('none', port, 'admin', 'supersecret');
        webServer.start();

        it(`Should successfully POST`, async () => {
            webServer.clearLogs();
            const dispatcher = new Dispatcher({
                device: {
                    hook: {
                        authenticationMethod: 'none',
                        endpoint: `http://localhost:${port}/webhook`,
                        method: 'POST',
                        successCodes: [200],
                        username: '',
                        password: ''
                    }
                }
            } as any);

            await dispatcher.dispatch({ test: 'data' }, 'device');

            expect(webServer.webHookLog.length).to.eql(1);
            expect(webServer.webHookLog[0].payload).to.eql({ test: 'data' }, 'device');
            expect(webServer.webHookLog[0].method).to.eql('post');
        });

        it(`Should successfully PUT`, async () => {
            webServer.clearLogs();
            const dispatcher = new Dispatcher({
                device: {
                    hook: {
                        authenticationMethod: 'none',
                        endpoint: `http://localhost:${port}/webhook`,
                        method: 'PUT',
                        successCodes: [200],
                        username: '',
                        password: ''
                    }
                }
            } as any);

            await dispatcher.dispatch({ test: 'data' }, 'device');

            expect(webServer.webHookLog.length).to.eql(1);
            expect(webServer.webHookLog[0].payload).to.eql({ test: 'data' }, 'device');
            expect(webServer.webHookLog[0].method).to.eql('put');
        });

        it(`Should successfully DELETE`, async () => {
            webServer.clearLogs();
            const dispatcher = new Dispatcher({
                device: {
                    hook: {
                        authenticationMethod: 'none',
                        endpoint: `http://localhost:${port}/webhook`,
                        method: 'DELETE',
                        successCodes: [200],
                        username: '',
                        password: ''
                    }
                }
            } as any);

            await dispatcher.dispatch({ test: 'data' }, 'device');

            expect(webServer.webHookLog.length).to.eql(1);
            expect(webServer.webHookLog[0].payload).to.eql({ test: 'data' }, 'device');
            expect(webServer.webHookLog[0].method).to.eql('delete');
        });

        it(`Should successfully PATCH`, async () => {
            webServer.clearLogs();
            const dispatcher = new Dispatcher({
                device: {
                    hook: {
                        authenticationMethod: 'none',
                        endpoint: `http://localhost:${port}/webhook`,
                        method: 'PATCH',
                        successCodes: [200],
                        username: '',
                        password: ''
                    }
                }
            } as any);

            await dispatcher.dispatch({ test: 'data' }, 'device');

            expect(webServer.webHookLog.length).to.eql(1);
            expect(webServer.webHookLog[0].payload).to.eql({ test: 'data' }, 'device');
            expect(webServer.webHookLog[0].method).to.eql('patch');
        });

        it(`Should succesfully POST with non-standard statusCode`, async () => {
            webServer.clearLogs();
            const dispatcher = new Dispatcher({
                device: {
                    hook: {
                        authenticationMethod: 'none',
                        endpoint: `http://localhost:${port}/webhook`,
                        method: 'POST',
                        successCodes: [404],
                        username: '',
                        password: ''
                    }
                }
            } as any);

            await dispatcher.dispatch({ test: 'data', statusCode: 404 }, 'device');

            expect(webServer.webHookLog.length).to.eql(1);
            expect(webServer.webHookLog[0].payload).to.eql({ test: 'data', statusCode: 404 });
            expect(webServer.webHookLog[0].method).to.eql('post');
        });
    });

    describe(`Basic Auth`, () => {

        const port = 5000;
        const webServer = new TestHttpServer('basic', port, 'admin', 'supersecret');
        webServer.start();

        it(`Should successfully POST with credentials supplied`, async () => {
            const dispatcher = new Dispatcher({
                device: {
                    hook: {
                        authenticationMethod: 'basic',
                        endpoint: `http://localhost:${port}/webhook`,
                        method: 'POST',
                        successCodes: [200],
                        username: 'admin',
                        password: 'supersecret'
                    }
                }
            } as any);

            await dispatcher.dispatch({ test: 'data' }, 'device');

            expect(webServer.webHookLog.length).to.eql(1);
            expect(webServer.webHookLog[0].payload).to.eql({ test: 'data' }, 'device');
            expect(webServer.webHookLog[0].method).to.eql('post');
        });
    });

    describe(`ApiKey Auth`, () => {

        const port = 5001;
        const webServer = new TestHttpServer('apiKey', port, 'x-api-key', 'my-secret');
        webServer.start();

        it(`Should successfully POST with Apikey supplied`, async () => {
            const dispatcher = new Dispatcher({
                device: {
                    hook: {
                        authenticationMethod: 'apiKey',
                        endpoint: `http://localhost:${port}/webhook`,
                        method: 'POST',
                        successCodes: [200],
                        username: 'x-api-key',
                        password: 'my-secret'
                    }
                }
            } as any);

            await dispatcher.dispatch({ test: 'data' }, 'device');

            expect(webServer.webHookLog.length).to.eql(1);
            expect(webServer.webHookLog[0].payload).to.eql({ test: 'data' }, 'device');
            expect(webServer.webHookLog[0].method).to.eql('post');
        });
    });

    describe(`Bearer Auth`, () => {

        const port = 5002;
        const webServer = new TestHttpServer('bearer', port, '', 'MYTOKEN123');
        webServer.start();

        it(`Should successfully POST with token supplied`, async () => {
            const dispatcher = new Dispatcher({
                device: {
                    hook: {
                        authenticationMethod: 'bearer',
                        endpoint: `http://localhost:${port}/webhook`,
                        method: 'POST',
                        successCodes: [200],
                        username: '',
                        password: 'MYTOKEN123'
                    }
                }
            } as any);

            await dispatcher.dispatch({ test: 'data' }, 'device');

            expect(webServer.webHookLog.length).to.eql(1);
            expect(webServer.webHookLog[0].payload).to.eql({ test: 'data' }, 'device');
            expect(webServer.webHookLog[0].method).to.eql('post');
        });
    });
});