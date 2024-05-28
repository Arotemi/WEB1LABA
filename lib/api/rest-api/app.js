import express     from 'express';
import bluebird    from 'bluebird';
import middlewares from './middlewares.js';
import mainRoutes  from './main/router.js';

const { promisify } = bluebird;

// Init app
const app = express();

let server = null;

export function start({ appPort, sequelize }) {
    app.use(middlewares.json);
    app.use(middlewares.clsMiddleware);
    app.use(middlewares.urlencoded);
    app.use(middlewares.cors);
    app.use('/apiv1', mainRoutes({ sequelize }));

    server = app.listen(appPort, () => {
        const { port, address } = server.address();

        global.REST_API_PORT = port; // For tests. TODO: export app and use it tests
        console.info(`[RestApiApp] STARTING AT PORT [${port}] ADDRESS [${address}]`);
    });

    server.closeAsync = promisify(server.close);
}

export async function stop() {
    if (!server) return;
    console.info('[RestApiApp] Closing server');
    await server.closeAsync();
}

export default app;
