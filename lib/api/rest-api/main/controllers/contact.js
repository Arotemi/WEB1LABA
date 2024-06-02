import Create         from '../../../../use-cases/main/contacts/Create.js';
import Delete         from '../../../../use-cases/main/contacts/Delete.js';
import List           from '../../../../use-cases/main/contacts/List.js';
import Update         from '../../../../use-cases/main/contacts/Update.js';
import Share          from '../../../../use-cases/main/contacts/Share.js';
import ListShared     from '../../../../use-cases/main/contacts/ListShared.js';
import ImportContacts from '../../../../use-cases/main/contacts/ImportContacts.js';

import chista from '../../chista.js';

export default {
    create     : chista.makeUseCaseRunner(Create, req => req.body),
    delete     : chista.makeUseCaseRunner(Delete, req => req.params),
    update     : chista.makeUseCaseRunner(Update, req => ({ ...req.params, ...req.body })),
    share      : chista.makeUseCaseRunner(Share, req => ({ ...req.params, ...req.body })),
    list       : chista.makeUseCaseRunner(List, req => req.query),
    listShared : chista.makeUseCaseRunner(ListShared, req => req.query),
    import     : chista.makeUseCaseRunner(ImportContacts, req => ({ file: req.files?.[0] }))
};
