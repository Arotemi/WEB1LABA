import ChistaException from 'chista/Exception.js';
import chista          from '../chista.js';

const Exception = ChistaException.default;

export async function runUseCase(useCaseClass, { context = {}, params = {}, logger = chista.defaultLogger }) {
    function logRequest({ type, result = undefined, error = undefined, startTime }) {
        // logger(type, {
        //     useCase : useCaseClass.name,
        //     runtime : Date.now() - startTime,
        //     context,
        //     params,
        //     result,
        //     error
        // });
    }

    const startTime = Date.now();

    try {
        const result = await new useCaseClass({ context }).run(params);

        logRequest({ type: 'info', result, startTime });

        return result;
    } catch (error) {
        const type = error instanceof Exception ? 'warn' : 'error';

        logRequest({ type, error, startTime });

        throw error;
    }
}

export function makeUseCaseRunner(
    useCaseClass,
    paramsBuilder  = chista.defaultParamsBuilder,
    contextBuilder = defaultContextBuilder,
    logger         = chista.defaultLogger,
    render         = renderPromiseAsJson
) {
    return async function useCaseRunner(req, res, next) {
        const resultPromise = runUseCase(useCaseClass, {
            // TODO: change
            logger,
            params  : paramsBuilder(req, res),
            context : contextBuilder(req, res)
        });

        return render(req, res, resultPromise, next, logger);
    };
}

function defaultContextBuilder(req) {
    let context = req?.session?.context || null;

    if (!context && (req.useragent || req.clientIp)) {
        context = {
            useragent : { ...req.useragent, ip: req.clientIp }
        };
    }

    if (!context) {
        context = {};
    }

    return cloneDeep(context);
}

function cloneDeep(data) {
    return JSON.parse(JSON.stringify(data));
}

export async function renderPromiseAsJson(req, res, promise, logger = chista.defaultLogger) {
    try {
        const data = await promise;

        return res.send(data);
    } catch (error) {
        return handlePromiseError(req, res, error, logger);
    }
}

export function handlePromiseError(req, res, error, logger = chista.defaultLogger) {
    /* istanbul ignore next */
    if (error instanceof Exception) {
        const responseCode = error.code === 'AUTHENTICATION_FAILED' ? 401 : 422;

        res.status(responseCode).send({
            error : error.toHash()
        });
    // } else if (error instanceof X.WrongId) {
    //     res.status(404).send({ error });
    } else {
        console.log(error);
        logger(
            'fatal',
            {
                'REQUEST_URL'    : req.url,
                'REQUEST_PARAMS' : req.params,
                'REQUEST_BODY'   : req.body,
                'ERROR_STACK'    : error.stack
            }
        );

        res.status(500).send({
            error : {
                code    : 'SERVER_ERROR',
                message : 'Please, contact your system administartor!'
            }
        });
    }
}
