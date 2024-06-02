import nodemailer        from 'nodemailer';
import sendmailTransport from 'nodemailer-sendmail-transport';
import smtpTransport     from 'nodemailer-smtp-transport';

const TRANSPORTS_BY_TYPE = {
    SMTP     : smtpTransport,
    SENDMAIL : sendmailTransport
};

class EmailSender {
    constructor({ mailOptions } = {}) {
        const { transport: transportType, transportOptions } = mailOptions || {};

        const options = {
            host : transportOptions.host,
            port : transportOptions.port,
            auth : (transportOptions.auth?.user || transportOptions.auth?.pass) ? transportOptions.auth : undefined
        };

        const transport = TRANSPORTS_BY_TYPE[transportType](options);

        if (!transport) throw new Error('Transport not found');

        this.transport = nodemailer.createTransport(transport, {
            ...transportOptions,
            service : 'gmail'
        });
        this.mailOptions = mailOptions;
    }

    // for testing
    setTransport(transport) {
        this.transport = transport;
    }

    async notify(title, destinationEmail, body) {
        return this.#sendEmail({
            from    : this.mailOptions.from,
            to      : destinationEmail,
            subject : title,
            html    : body
        });
    }

    async notifyUsers(title, users, body) {
        const emails = users.filter(user => user.email).map(user => user.email);

        return this.#sendEmail({
            from    : this.mailOptions.from,
            bcc     : emails,
            subject : title,
            html    : body
        });
    }

    #sendEmail = async (data) => {
        const response = await this.transport.sendMail(data);

        return response.response;
    }
}

export default EmailSender;
