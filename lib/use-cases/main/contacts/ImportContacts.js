import fs                    from 'fs';
import crypto                from 'crypto';
import UseCaseBase           from '../../Base.js';
import { parseExcel }        from '../../../utils/parseExcel.js';
import Job                   from '../../../domain-model/Job.js';
import { ImportContactsJob } from '../../../jobs/ImportContacts.js';

const exelProductsStructure = {
    'A' : 'firstName',
    'B' : 'lastName',
    'C' : 'phone'
};

export default class ImportContacts extends UseCaseBase {
    async validate(data = {}, additionalRules) {
        console.log(data);
        const rules = {
            file : [ 'required', 'not_empty', { 'nested_object' : {
                originalname : [ 'required', 'string', 'trim' ],
                fieldname    : [ 'required', 'string' ],
                mimetype     : [ 'required', 'string', { 'one_of' :
                            [
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'application/vnd.ms-excel',
                                'text/csv'
                            ] } ],
                size   : [ { 'max_number': 26_214_400 } ],
                buffer : [ 'required' ]
            } } ],
            ...additionalRules
        };
        const validatedData = await this.doValidation(data, rules);

        const parsedFile = parseExcel(validatedData.file.buffer, exelProductsStructure);

        try {
            const validatedFile = await this.doValidation(parsedFile, {
                data : [ {
                    'list_of_objects' : [
                        {
                            firstName : [ 'required', 'string' ],
                            lastName  : [ 'trim', 'string', 'not_empty', 'required', { 'max_length': 255 } ],
                            phone     : [ 'trim', 'string' ]
                        }
                    ]
                } ]
            });


            console.log('here');
            console.log(validatedFile);

            return validatedFile;
        } catch (error) {
            throw new X.default({
                code   : 'WRONG_IMPORT_DATA',
                fields : {}
            });
        }
    }


    async execute(data) {
        const id = crypto.randomUUID();

        await fs.promises.writeFile(`./tmp/${id}.json`, JSON.stringify(data.data));

        const queue = ImportContactsJob.getQueue();

        const job = await Job.create({ type: 'IMPORT', status: 'PENDING', data: { id, userId: this.context.userId } });

        await queue.add(`sendEmail${job.id}`, { id, jobId: job.id, userId: this.context.userId }, {
            backoff : {
                type  : 'fixed',
                delay : 60 * 60 * 1000
            }
        });

        return { };
    }
}
