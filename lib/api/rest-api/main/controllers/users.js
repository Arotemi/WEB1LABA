import chista from '../../chista.js';

import UsersSendEmail from '../../../../use-cases/main/users/SendEmail.js';

export default {
    sendEmail : chista.makeUseCaseRunner(UsersSendEmail, req => req.body)
};
