import Contact       from '../../../domain-model/Contact.js';
import SharedContact from '../../../domain-model/SharedContact.js';
import UseCaseBase   from '../../Base.js';

export default class Update extends UseCaseBase {
    static validationRules = {
        id        : [ 'required', 'positive_integer' ],
        firstName : [ 'required', 'string' ],
        lastName  : [ 'required', 'string' ],
        phone     : [ 'required', 'string', 'phone' ]
    }

    async execute({ id, ...data }) {
        const sharedContact = await SharedContact.scope({ method: [ 'userId', this.context.userId ] }).findOne({ where: { contactId: id } });

        let contact = await Contact.scope({ method: [ 'userId', this.context.userId ] }).findOne({ where: { id } });

        if (!contact && sharedContact) {
            contact = await Contact.findById(id);
        }

        await contact.update(data);

        return contact;
    }
}
