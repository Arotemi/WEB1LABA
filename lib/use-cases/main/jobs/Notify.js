import UseCaseBase from '../../Base.js';
import { users }   from '../../../../app.js';

export default class NotifyJobs extends UseCaseBase {
    static validationRules = {
    }

    async execute() {
        Object.values(users)
            .forEach(ws => ws.send(JSON.stringify({ data: {}, type: 'new_job' })));
    }
}
