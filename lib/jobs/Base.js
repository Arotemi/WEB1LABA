import config from '../config.cjs';

export class Base {
    constructor() {}

    static connection = {
        host : config.redis.host,
        port : config.redis.port
    };

    static queue = null;

    static sequelizeInstance   = null;

    static notificatorInstance = null;

    static setSequelizeInstance(sequelize) {
        Base.sequelizeInstance = sequelize;
    }

    static setNotificatorInstance(notificator) {
        Base.notificatorInstance = notificator;
    }

    static setConnection(connection) {
        Base.connection = connection;
    }

    initialize() {
        throw new Error('Method is not implemented');
    }

    execute() {
        throw new Error('Method is not implemented');
    }

    static getQueue() {
        throw new Error('Method is not implemented');
    }
}
