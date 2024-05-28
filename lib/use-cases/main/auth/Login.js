import Exception       from 'chista/Exception.js';
import UseCaseBase     from '../../Base.js';
import User            from '../../../domain-model/User.js';
import { dumpContext } from '../utils/dumps.js';

export default class Login extends UseCaseBase {
    static validationRules = {
        email    : [ 'required', 'email', { 'max_length': 255 } ],
        password : [ 'required', 'string', { 'length_between': [ 8, 25 ] } ]
    }

    async execute({ email, password }) {
        const user = await User.scope({ method: [ 'email', email ] }).findOne();

        if (!user) {
            throw new Exception.default({ code: 'WRONG_EMAIL_OR_PASSWORD', fields: { } });
        }

        if (!user.checkPassword(password)) {
            throw new Exception.default({ code: 'WRONG_EMAIL_OR_PASSWORD', fields: { } });
        }

        return {
            context : dumpContext(user, this.context.useragent)
        };
    }
}
