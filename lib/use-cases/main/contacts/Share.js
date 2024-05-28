import SharedContact from '../../../domain-model/SharedContact.js';
import UseCaseBase   from '../../Base.js';

export default class Share extends UseCaseBase {
    static validationRules = {
        id     : [ 'required', 'positive_integer' ],
        userId : [ 'required', 'positive_integer' ]
    }

    async execute({ id, userId }) {
        await SharedContact.create({ contactId: id, userId });

        return { };
    }
}
