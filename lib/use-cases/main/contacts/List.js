import Contact     from '../../../domain-model/Contact.js';
import UseCaseBase from '../../Base.js';

export default class List extends UseCaseBase {
    static validationRules = {
        id      : [ { 'list_or_one': [ 'positive_integer' ] }, 'to_array' ],
        search  : [ 'string' ],
        limit   : [ 'positive_integer', { default: 10 } ],
        offset  : [ 'integer', { 'min_number': 0 }, { default: 0 } ],
        sortBy  : [ { 'one_of': [ 'createdAt', 'name' ] }, { default: 'createdAt' } ],
        orderBy : [ { 'one_of': [ 'ASC', 'DESC' ] }, { default: 'DESC' } ]
    }

    async execute({ id, search, sortBy, orderBy, limit, offset }) {
        const contact = await Contact.scope([
            { method: [ 'id', id ] },
            { method: [ 'userId', this.contex ] },
            { method: [ 'search', search ] }
        ]).findAll({
            order : [ [ sortBy, orderBy ] ],
            limit,
            offset
        });

        return contact;
    }
}


// change
