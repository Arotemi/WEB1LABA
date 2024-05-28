import { WebSocketServer } from 'ws';
import * as RestAPI        from './lib/api/rest-api/app.js';
import * as DomainModel    from './lib/domain-model/index.js';
import config              from './lib/config.cjs';
import UseCaseBase         from './lib/use-cases/Base.js';

async function main() {
    console.log(`[App] Init Mode: ${process.env.MODE}`);
    initWs();

    // Init Domain Model Layer
    const dbMode = process.env.MODE === 'application' ? 'db' : 'test-db';
    const { sequelize } = await DomainModel.initModels(config[dbMode]);

    UseCaseBase.setSequelizeInstance(sequelize);
    RestAPI.start({ appPort: config.appPort, sequelize });

    // Subscribe to system signals
    process.on('SIGTERM', async () => {
        console.info('[App] SIGTERM signal catched');

        await shutdown();
    });

    process.on('SIGINT', async () => {
        console.info('[App] SIGINT signal catched');

        await shutdown();
    });

    process.on('unhandledRejection', error => {
        console.error(error);
    });

    process.on('uncaughtException', error => {
        console.error(error);
    });

    // Graceful shutdown
    async function shutdown() {
        await RestAPI.stop();

        console.info('[App] Exit');
        process.exit(0);
    }
}

export const users = {};

function initWs() {
    const wss = new WebSocketServer({ port: 8082 });

    wss.on('connection', (ws) => {
        const userId = Math.random().toString(36).slice(2);

        ws.on('message', (message) => {
            const data = JSON.parse(message);

            if (data.type === 'save-connection' && data.userId) {
                ws.userId = data.userId; // Save the userId directly on the WebSocket instance
                users[data.userId] = ws;
            }

            if (data.type === 'update') {
                const userWs = users[data.data.userId];

                userWs.send(JSON.stringify({ data: data.data, type: 'update' }));
            }
        });

        ws.onclose = function () {
            removeClient(ws);
        };
    });
}

function removeClient(ws) {
    const userId = ws.userId;

    if (userId && users[userId]) {
        delete users[userId];
        console.log(`Client Disconnect: ${userId}. ${Object.keys(users).length} Online`);
    } else {
        console.log('Error: User not found in users object.');
    }

    console.log(users);
}

main().catch((err) => {
    console.error(err);

    process.exit(1);
});
