import UseCaseBase     from '../../Base.js';
import User            from '../../../domain-model/User.js';
import { dumpContext } from '../utils/dumps.js';

export default class Registration extends UseCaseBase {
    static validationRules = {
        email     : [ 'required', 'email', { 'max_length': 255 } ],
        name      : [ 'required', 'string', { 'max_length': 255 } ],
        password  : [ 'required', 'string', { 'length_between': [ 8, 25 ] } ],
        birthDate : [ 'required', { 'iso_date': { max: 'current' } } ]
    }

    async execute(data) {
        const user = await User.create(data);

        return {
            context : dumpContext(user, this.context.useragent)
        };
    }
}


// change