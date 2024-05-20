import * as RestAPI     from './lib/api/rest-api/app.js';
import * as DomainModel from './lib/domain-model/index.js';
import config           from './lib/config.cjs';
import UseCaseBase      from './lib/use-cases/Base.js';

async function main() {
    console.log(`[App] Init Mode: ${process.env.MODE}`);

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

main().catch((err) => {
    console.error(err);

    process.exit(1);
});

// change
