import Base    from './../../Base.js';
import Session from './../../../domain-model/Session.js';

export default class SessionsCheck extends Base {
    static validationRules = {
        session : [ 'required' ]
    };

    async execute({ session }) {
        await Session.validateSession(session);

        return { };
    }
}


// change