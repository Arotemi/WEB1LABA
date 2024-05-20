import Contact     from '../../../domain-model/Contact.js';
import UseCaseBase from '../../Base.js';

export default class Delete extends UseCaseBase {
    static validationRules = {
        id : [ 'required', 'positive_integer' ]
    }

    async execute({ id }) {
        const contact = await Contact.scope({ method: [ 'userId', this.context.userId ] }).findById(id);

        await contact.destroy();

        return {};
    }
}


// change