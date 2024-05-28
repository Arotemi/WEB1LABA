import SharedContact from '../../../domain-model/SharedContact.js';
import UseCaseBase   from '../../Base.js';

export default class ListShared extends UseCaseBase {
    static validationRules = {
        limit   : [ 'positive_integer', { default: 10 } ],
        offset  : [ 'integer', { 'min_number': 0 }, { default: 0 } ],
        sortBy  : [ { 'one_of': [ 'createdAt', 'firstName', 'lastName' ] }, { default: 'createdAt' } ],
        orderBy : [ { 'one_of': [ 'ASC', 'DESC' ] }, { default: 'DESC' } ]
    }

    async execute({ sortBy, orderBy, limit, offset }) {
        const contacts = await SharedContact.scope({
            method : [ 'userId', this.context.userId ]
        }).findAll({
            include : [ 'contact' ],
            order   : [ [ sortBy, orderBy ] ],
            limit,
            offset
        });

        return contacts.map(c => c.contact);
    }
}
