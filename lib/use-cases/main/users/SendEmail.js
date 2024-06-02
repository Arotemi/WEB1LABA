import UseCaseBase   from '../../Base.js';
import { SendEmail } from '../../../jobs/SendEmail.js';
import Job           from '../../../domain-model/Job.js';

export default class UsersSendEmail extends UseCaseBase {
    static validationRules = {
        emails  : [ { list_of: [ 'email' ] }, 'required' ],
        subject : [ 'string', 'required' ],
        body    : [ 'string', 'required' ]
    }

    async execute({ emails, subject, body }) {
        const queue = SendEmail.getQueue();

        const job = await Job.create({ type: 'EMAIL', data: { emails, subject, body }, status: 'PENDING' });

        await queue.add(`sendEmail${job.id}`, { emails, subject, body, jobId: job.id }, {
            backoff : {
                type  : 'fixed',
                delay : 60 * 60 * 1000
            }
        });

        return {};
    }
}
