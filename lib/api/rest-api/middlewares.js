import { randomUUID }        from 'crypto';
import * as fs               from 'fs';
import bodyParser            from 'body-parser';
import cors                  from 'cors';
import multer                from 'multer';
import { v4 as uuidv4 }      from 'uuid';
import connectSequelizeStore from 'connect-session-sequelize';
import session               from 'express-session';
import useragent             from 'express-useragent';
import requestIp             from 'request-ip';
import clsNamespace          from '../../clsNamespace.js';
import config                from '../../config.cjs';

function extendDefaultFields(defaults, sessionObj) {
    return {
        data    : defaults.data,
        expires : defaults.expires,
        userId  : sessionObj?.context?.userId
    };
}

export default {
    detectDevice  : useragent.express(),
    detectIp      : requestIp.mw(),
    clsMiddleware : (req, res, next) => {
        // req and res are event emitters. We want to access CLS context inside of their event callbacks
        clsNamespace.bind(req);
        clsNamespace.bind(res);

        const traceID = randomUUID();

        clsNamespace.run(() => {
            clsNamespace.set('traceID', traceID);

            console.info({
                pathname : req._parsedUrl.pathname,
                method   : req.method,
                body     : req.body,
                query    : req.query
            });

            next();
        });
    },
    json : bodyParser.json({ limit  : 1024 * 1024,
        verify : (req, res, buf) => {
            try {
                JSON.parse(buf);
            } catch (e) {
                res.status(422).send({
                    error : {
                        code    : 'BROKEN_JSON',
                        message : 'Please, verify your json'
                    }
                });
                throw new Error('BROKEN_JSON');
            }
        } }),
    urlencoded : bodyParser.urlencoded({ extended: true }),
    cors       : cors({ origin: true, credentials: true }),
    fileUpload : () => {
        const storage = multer.diskStorage({

            destination(req, file, callback) {
                const path = './uploads';

                fs.mkdirSync(path, { recursive: true }); // eslint-disable-line no-sync
                callback(null, path);
            },
            filename(req, file, callback) {
                callback(null, uuidv4());
            }
        });
        const FILE_LIMIT = 26_214_400; // 25Mb

        return multer({
            storage,
            limits : { fieldSize: FILE_LIMIT }
        });
    },
    sequelizeSession : ({ sequelize }) => {
        const { secret, expires, secure, name } = config.sessions;
        const SequelizeStore = connectSequelizeStore(session.Store);

        const sess = {
            secret,
            cookie : {
                secure,
                httpOnly : true,
                maxAge   : expires,
                sameSite : secure ? 'lax' : undefined
            },
            name,
            // proxy             : secure || undefined,
            resave            : false,
            saveUninitialized : false,
            unset             : 'destroy',
            // domain            : ''
            store             : new SequelizeStore({
                db    : sequelize,
                table : 'Sessions',
                extendDefaultFields
            })
        };

        return session(sess);
    }
};
