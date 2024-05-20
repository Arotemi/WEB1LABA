import ServiceBase from 'chista/ServiceBase.js';

import './registerValidationRules.js';

const ChistaUseCaseBase = ServiceBase.default;

export default class UseCaseBase extends ChistaUseCaseBase {
    constructor(...params) {
        super(...params);

        this.sequelizeInstance = UseCaseBase.sequelizeInstance;
    }

    static sequelizeInstance = null;

    run(...args) {
        if (!UseCaseBase.sequelizeInstance) /* c8 ignore next */ return super.run(...args);

        const run = super.run.bind(this);
        const transaction = global.testTransaction /* c8 ignore next */ || null;

        return UseCaseBase.sequelizeInstance.transaction({ transaction }, () => run(...args));
    }

    static setSequelizeInstance(sequelize) {
        UseCaseBase.sequelizeInstance = sequelize;
    }
}
