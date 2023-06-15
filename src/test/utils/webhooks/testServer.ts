import express from 'express';
import { AuthenticationType } from '../../../config/settings';
export class TestHttpServer {
    constructor(
        private authType: AuthenticationType,
        private port: number,
        private username: string,
        private password: string) {

    }

    public webHookLog: WebhookLog[] = [];

    public start() {
        const app = express();

        app.use(express.json());

        this.initialiseAuth(app);

        const handleRequest = (method, req, res) => {
            this.webHookLog.push({ method: method, payload: req.body });
            if (req.body.statusCode) {
                res.status(req.body.statusCode);
            }
            res.send('Successfully received webhook');
        };

        app.post('/webhook', async (req, res) => {
            handleRequest('post', req, res);
        });

        app.put('/webhook', async (req, res) => {
            handleRequest('put', req, res);
        });

        app.patch('/webhook', async (req, res) => {
            handleRequest('patch', req, res);
        });

        app.delete('/webhook', async (req, res) => {
            handleRequest('delete', req, res);
        });

        app.listen(this.port, () => console.log(`Hello world app listening on port ${this.port}!`));
    }

    public clearLogs() {
        this.webHookLog = [];
    }

    private initialiseAuth(app) {

        switch (this.authType) {
            case 'basic':
                const basicAuth = require('express-basic-auth');
                const user = {};
                user[this.username] = this.password;
                app.use(basicAuth({
                    users: user
                }));
                break;
            case 'apiKey':
                app.use((req, res, next) => {
                    const apiKey = req.headers[this.username];
                    if (!apiKey || apiKey !== this.password) {
                        res.status(401);
                        res.send();
                    }
                    next();
                });
                break;
            case 'bearer':
                app.use((req, res, next) => {
                    const authHeader = req.headers.authorization;
                    if (!authHeader || authHeader !== `Bearer ${this.password}`) {
                        res.status(401);
                        res.send();
                    }
                    next();
                });
                break;
        }
    }
}

export interface WebhookLog {
    method: string;
    payload: any;
}
