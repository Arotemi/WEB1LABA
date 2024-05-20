import UseCaseBase  from '../../Base.js';
import User         from '../../../domain-model/User.js';
import { dumpUser } from '../utils/dumps.js';

export default class Profile extends UseCaseBase {
    static validationRules = {
    }

    async execute() {
        const user = await User.findById(this.context.userId);

        return dumpUser(user);
    }
}


// change