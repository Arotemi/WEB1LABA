import Sequelize  from 'sequelize';
import Exception  from 'chista/Exception.js';
import {
    generateId,
    generateIds
} from '../utils/index.js';

class Base extends Sequelize.Model {
    static init(sequelize, options = {}) {
        super.init(this.schema, { ...options, ...this.options, sequelize });
    }

    static initRelationsAndHooks() {
        if (this.initRelations) this.initRelations();
        if (this.initHooks) this.initHooks();
    }

    static async findById(id, args) {
        const entity = await this.findOne({ where: { id }, ...args });

        if (!entity) {
            throw new Exception.default({
                code   : 'WRONG_ID',
                fields : { id: 'WRONG_ID' }
            });
        }

        return entity;
    }

    static async bulkCreate(data = [], ...args) {
        const ids = generateIds(data.length);
        const dataWithIds = data.map((item, index) => ({ id: ids[index], ...item }));

        return super.bulkCreate(dataWithIds, ...args);
    }

    static async create(data = {}, ...args) {
        const id = generateId();

        return super.create({ id, ...data }, ...args);
    }

    static async findOrCreate(data = {}, args) {
        const id = generateId();

        return super.findOrCreate({
            ...args,
            defaults : { id, ...data }
        });
    }

    static async upsert(data = {}, ...args) {
        const id = generateId();

        return super.upsert({ id, ...data }, ...args);
    }

    static async createOrUpdate(data = {}, args) {
        const instance = await super.findOne({ ...args });

        return instance
            ? instance.update({ ...data })
            : this.create({ ...data });
    }

    async save(...args) {
        try {
            return await super.save(...args);
        } catch (x) {
            if (x instanceof Sequelize.UniqueConstraintError) {
                const error = x.errors[0];

                throw new Exception.default({
                    code   : 'NOT_UNIQUE',
                    fields : { [`${error.path}`]: 'NOT_UNIQUE' }
                });
            }

            throw x;
        }
    }
}

export default Base;
