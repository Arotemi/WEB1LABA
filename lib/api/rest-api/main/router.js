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
    router.get('/users', checkSession, controllers.auth.users);
    router.get('/users/online', controllers.auth.usersOnline);
    router.post('/users/send_email', controllers.users.sendEmail);

    router.post('/contacts', checkSession, controllers.contact.create);
    router.post('/contacts/shared', checkSession, controllers.contact.create);
    router.delete('/contacts/:id', checkSession, controllers.contact.delete);
    router.patch('/contacts/:id', checkSession, controllers.contact.update);
    router.post('/contacts/:id/share', checkSession, controllers.contact.share);
    router.get('/contacts', checkSession, controllers.contact.list);
    router.get('/contacts/shared', checkSession, controllers.contact.listShared);
    router.post('/contacts/import', [ checkSession, middlewares.fileUpload().any() ], controllers.contact.import);

    router.get('/jobs', controllers.jobs.list);
    router.post('/jobs/notify', controllers.jobs.notify);

    return router;
}

