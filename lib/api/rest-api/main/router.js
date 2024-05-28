import express     from 'express';
import swaggerUi   from 'swagger-ui-express';
import middlewares from '../middlewares.js';
import swagger     from '../utils/swagger.js';
import controllers from './controllers/index.js';

const document = await swagger('./apidoc/main.json');

const router = express.Router();
const { sequelizeSession, detectDevice, detectIp } = middlewares;
const checkSession = controllers.auth.check;

export default function init({ sequelize }) {
    router.use(sequelizeSession({ sequelize }));
    router.use('/apidoc', swaggerUi.serveFiles(document), swaggerUi.setup(document));

    router.get('/ping', (req, res) => res.send('pong'));

    router.post('/registration', detectIp, detectDevice, controllers.auth.register);
    router.post('/login', detectIp, detectDevice, controllers.auth.login);
    router.get('/profile', checkSession, controllers.auth.profile);
    router.get('/customers', checkSession, controllers.auth.users);
    router.get('/customers/online', controllers.auth.usersOnline);

    router.post('/users', checkSession, controllers.contact.create);
    router.post('/users/shared', checkSession, controllers.contact.create);
    router.delete('/users/:id', checkSession, controllers.contact.delete);
    router.patch('/users/:id', checkSession, controllers.contact.update);
    router.post('/users/:id/share', checkSession, controllers.contact.share);
    router.get('/users', checkSession, controllers.contact.list);
    router.get('/users/shared', checkSession, controllers.contact.listShared);

    return router;
}

