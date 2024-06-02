import chista from '../../chista.js';

import ListJobs   from '../../../../use-cases/main/jobs/ListJobs.js';
import NotifyJobs from '../../../../use-cases/main/jobs/Notify.js';

export default {
    list   : chista.makeUseCaseRunner(ListJobs, req => req.body),
    notify : chista.makeUseCaseRunner(NotifyJobs, req => req.body)
};
