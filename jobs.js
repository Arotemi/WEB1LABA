import IORedis from 'ioredis';
import config  from './lib/config.cjs';

import * as DomainModel from './lib/domain-model/index.js';

import EmailSender from './lib/infrastructure/notificator/Mail.js';

import { Base } from './lib/jobs/Base.js';

import { SendEmail }         from './lib/jobs/SendEmail.js';
import { ImportContactsJob } from './lib/jobs/ImportContacts.js';

async function main() {
    const notificator = new EmailSender({
        mailOptions : config.mail
    });
    const redisConnection = new IORedis({ ...config.redis, maxRetriesPerRequest: null });
    // Init Domain Model Layer
    const { sequelize } = await DomainModel.initModels(config.db);

    Base.setSequelizeInstance(sequelize);
    Base.setNotificatorInstance(notificator);
    Base.setConnection(redisConnection);

    const sendEmail      = new SendEmail();
    const importContacts = new ImportContactsJob();

    sendEmail.initialize();
    importContacts.initialize();

    // Subscribe to system signals
    process.on('SIGTERM', async () => {
        await shutdown();
    });

    process.on('SIGINT', async () => {
        await shutdown();
    });

    process.on('unhandledRejection', error => {
        console.error(error);

        console.info(
            'UnhandledRejection',
            { error: error.stack }
        );
    });

    process.on('uncaughtException', error => {
        console.error(error);

        console.log(
            'UncaughtException',
            { error: error.stack }
        );
    });

    // Graceful shutdown
    async function shutdown() {
        await sequelize.close();
        await redisConnection.quit();

        console.info('[App] Exit');
        process.exit(0);
    }
}

main().catch((err) => {
    console.error(err);

    process.exit(1);
});
