import UseCaseBase from '../../Base.js';
import Job         from '../../../domain-model/Job.js';

export default class ListJobs extends UseCaseBase {
    static validationRules = {
    }

    async execute() {
        const jobs = await Job.findAll();

        return jobs.map(j => ({ ...j.dataValues, data: JSON.stringify(j.data), result: JSON.stringify(j.result) }));
    }
}
