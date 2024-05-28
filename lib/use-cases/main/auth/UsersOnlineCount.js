import { Op }       from 'sequelize';
import UseCaseBase  from '../../Base.js';
import User         from '../../../domain-model/User.js';
import { dumpUser } from '../utils/dumps.js';
import { users }    from '../../../../app.js';

export default class UsersOnlineCount extends UseCaseBase {
    static validationRules = {}

    async execute() {
        const usersFromDb = await User.findAll({ where : {
            id : { [Op.in]: Object.keys(users).filter(id => id !== this.context.userId) }
        } });

        return usersFromDb.map(dumpUser);
    }
}
