/* eslint-disable more/no-duplicated-chains */
import fs                from 'fs';
import { Queue, Worker } from 'bullmq';

import fetch    from 'node-fetch';
import Job      from '../domain-model/Job.js';
import Contact  from '../domain-model/Contact.js';
import { Base } from './Base.js';

export class ImportContactsJob extends Base {
    constructor() {
        super();
    }

    static getQueue() {
        if (!ImportContactsJob.queue) {
            ImportContactsJob.queue = new Queue('IMPORT', {
                connection: ImportContactsJob.connection
            });
        }
        return ImportContactsJob.queue;
    }

    initialize() {
        this.worker = new Worker('IMPORT', this.execute.bind(this), {
            connection: ImportContactsJob.connection,
            autorun: true,
            concurrency: 5,
            removeOnComplete: { age: 0, count: 0 },
            removeOnFail: { age: 0, count: 0 }
        });
    }

    async execute(job) {
        const { jobId, userId, id } = job.data;

        let data;
        try {
            const file = await fs.promises.readFile(`./tmp/${id}.json`);
            data = JSON.parse(file);
        } catch (error) {
            console.error("Error reading the file:", error);
            return this.failJob(jobId, "File read error");
        }

        const jobFromDb = await Job.findById(jobId);
        if (!jobFromDb) {
            console.error("Job not found in DB");
            return;
        }

        try {
            await Contact.bulkCreate(data.map(c => ({ ...c, userId })));
            await jobFromDb.update({ status: 'SUCCESS', result: { success: true } });
            await fs.promises.unlink(`./tmp/${id}.json`);
            await this.notifyJobCompletion({});
        } catch (error) {
            await jobFromDb.update({ status: 'FAILED' });
            await this.notifyJobCompletion({});
            console.error("Error executing the job:", error);
            throw error;
        }
    }

    async failJob(jobId, message) {
        const jobFromDb = await Job.findById(jobId);
        if (jobFromDb) {
            await jobFromDb.update({ status: 'FAILED', result: { success: false, message } });
        }
        await this.notifyJobCompletion({});
    }

    async notifyJobCompletion(data) {
        try {
            await fetch('http://localhost:8080/apiv1/jobs/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error("Error notifying job completion:", error);
        }
    }
}