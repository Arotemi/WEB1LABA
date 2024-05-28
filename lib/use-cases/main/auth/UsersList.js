import { Op }       from 'sequelize';
import UseCaseBase  from '../../Base.js';
import User         from '../../../domain-model/User.js';
import { dumpUser } from '../utils/dumps.js';

export default class UsersList extends UseCaseBase {
    static validationRules = {}

    async execute() {
        const users = await User.findAll({ where: { id: { [Op.ne]: this.context.userId } } });

        return users.map(dumpUser);
    }
}
