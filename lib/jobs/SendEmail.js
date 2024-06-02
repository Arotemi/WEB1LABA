/* eslint-disable more/no-duplicated-chains */
import { Queue, Worker } from 'bullmq';

import fetch       from 'node-fetch';
import EmailSender from '../infrastructure/notificator/Mail.js';
import config      from '../config.cjs';

import Job      from '../domain-model/Job.js';
import { Base } from './Base.js';

const notificator = new EmailSender({ mailOptions: config.mail });

export class SendEmail extends Base {
    constructor() {
        super();
    }

    static getQueue() {
        if (!SendEmail.queue) {
            SendEmail.queue = new Queue('SEND_EMAIL', {
                connection: SendEmail.connection
            });
        }
        return SendEmail.queue;
    }

    initialize() {
        this.worker = new Worker('EMAIL_NEWSLETTER', this.execute.bind(this), {
            connection: SendEmail.connection,
            autorun: true,
            concurrency: 5,
            removeOnComplete: { age: 0, count: 0 },
            removeOnFail: { age: 0, count: 0 }
        });
    }

    async execute(job) {
        const { jobId, emails, subject, body } = job.data;
        const jobFromDb = await Job.findById(jobId);

        if (!jobFromDb) {
            console.error("Job not found in DB");
            return;
        }

        try {
            const result = await notificator.notifyUsers(subject, emails.map(email => ({ email })), body);
            await jobFromDb.update({ status: 'SUCCESS', result });
            await this.notifyJobCompletion({});
        } catch (error) {
            console.error("Error executing the job:", error);
            await jobFromDb.update({ status: 'FAILED' });
            await this.notifyJobCompletion({});
            throw error;
        }
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
