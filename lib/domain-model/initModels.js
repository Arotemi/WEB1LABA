import cls       from 'cls-hooked';
import Sequelize from 'sequelize';

import User    from './User.js';
import Session from './Session.js';
import Contact from './Contact.js';

Sequelize.useCLS(cls.createNamespace('sequelize-transactions-namespace'));

export default async function initAllModels(dbConfig) {
    const { database, username, password, dialect, host, port } = dbConfig;

    const sequelize = new Sequelize(database, username, password, {
        host,
        port,
        dialect,
        logging        : false,
        dialectOptions : {
            connectTimeout : 3000
        },
        pool : {
            min     : 0,
            max     : 100,
            idle    : 1000,
            acquire : 3000
        },
        retry : { // Set of flags that control when a query is automatically retried.
            match : [
                /SequelizeConnectionError/,
                /SequelizeConnectionRefusedError/,
                /SequelizeHostNotFoundError/,
                /SequelizeHostNotReachableError/,
                /SequelizeInvalidConnectionError/,
                /SequelizeConnectionTimedOutError/,
                /TimeoutError/,
                /SequelizeDatabaseError/
            ],
            max : 0
        }
    });

    const models = {
        User,
        Session,
        Contact
    };

    Object.values(models).forEach(model => model.init(sequelize));
    Object.values(models).forEach(model => model.initRelationsAndHooks(sequelize));

    return {
        ...models,
        sequelize
    };
}
