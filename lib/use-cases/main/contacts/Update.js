import Contact     from '../../../domain-model/Contact.js';
import UseCaseBase from '../../Base.js';

export default class Update extends UseCaseBase {
    static validationRules = {
        id        : [ 'required', 'positive_integer' ],
        firstName : [ 'required', 'string' ],
        lastName  : [ 'required', 'string' ],
        phone     : [ 'required', 'string', 'phone' ]
    }

    async execute({ id, ...data }) {
        const contact = await Contact.scope({ method: [ 'userId', this.context.userId ] }).findById(id);

        await contact.update(data);

        return contact;
    }
}


// change