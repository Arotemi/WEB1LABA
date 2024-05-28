import chista            from '../../chista.js';
import { sessionRender } from '../../sessionRender.mjs';

import Login                   from '../../../../use-cases/main/auth/Login.js';
import Registration            from '../../../../use-cases/main/auth/Registration.js';
import SessionsCheck           from '../../../../use-cases/main/auth/Check.js';
import { renderPromiseAsJson } from '../../utils/chistaUtils.mjs';
import Profile                 from '../../../../use-cases/main/auth/Profile.js';
import UsersList               from '../../../../use-cases/main/auth/UsersList.js';
import UsersOnlineCount        from '../../../../use-cases/main/auth/UsersOnlineCount.js';

export default {
    register : chista.makeUseCaseRunner(Registration, req => ({
        ...req.body,
        useragent : { ...req.useragent, ip: req.clientIp }
    }), undefined, undefined, sessionRender),
    login : chista.makeUseCaseRunner(Login, req => ({
        ...req.body,
        useragent : { ...req.useragent, ip: req.clientIp }
    }), undefined, undefined, sessionRender),
    async check(req, res, next) {
        const promise = chista.runUseCase(SessionsCheck, {
            params : { session: { context: req.session.context } }
        });

        try {
            await promise;

            return next();
        } catch (e) {
            return renderPromiseAsJson(req, res, promise);
        }
    },
    profile     : chista.makeUseCaseRunner(Profile, req => req.body),
    users       : chista.makeUseCaseRunner(UsersList, req => req.body),
    usersOnline : chista.makeUseCaseRunner(UsersOnlineCount, req => req.body)
};
