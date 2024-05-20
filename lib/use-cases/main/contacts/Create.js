import Contact     from '../../../domain-model/Contact.js';
import UseCaseBase from '../../Base.js';

export default class Create extends UseCaseBase {
    static validationRules = {
        firstName : [ 'required', 'string' ],
        lastName  : [ 'required', 'string' ],
        phone     : [ 'required', 'string', 'phone' ]
    }

    async execute(data) {
        const contact = await Contact.create({
            ...data,
            userId : this.context.userId
        });

        return contact;
    }
}


// change