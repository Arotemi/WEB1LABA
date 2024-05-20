import LIVR       from 'livr';
import extraRules from 'livr-extra-rules';
import livrUtils  from 'livr/lib/util.js';

function validateRules(value, rules, outputArr) {
    const validator = new LIVR.Validator({
        value : rules
    });
    const result = validator.validate({ value });

    if (!result) {
        return validator.getErrors().value;
    }

    outputArr.push(result.value);

    return;
}

function isUnset(value) {
    return (value === undefined || value === null || value === '');
}

const defaultRules = {
    ...extraRules,
    null() {
        return (value, params, outputArr) => {
            if (value !== 'null' && value !== null) return 'NOT_NULL';

            outputArr.push(null);
        };
    },
    to_array() {
        return (value, params, outputArr) => {
            if (isUnset(value)) return;

            if (!Array.isArray(value)) {
                outputArr.push([ value ]);

                return;
            }

            return;
        };
    },
    list_or_one(rule) {
        return (value, params, outputArr) => {
            if (isUnset(value)) return;

            return validateRules(
                value,
                {
                    'or' : [
                        rule,
                        { 'list_of': rule }
                    ]
                },
                outputArr
            );
        };
    },
    rules_if(fields) {
        return (value, params, outputArr) => {
            for (const field in fields.if) {
                if (fields.if.hasOwnProperty(field)) {
                    const data = params[field] || value?.[field];

                    if (validateRules(data, fields.if[field], [])) return;
                }
            }

            return validateRules(value, fields.rules, outputArr);
        };
    },
    uniq() {
        return (value, params, outputArr) => {
            if (isUnset(value)) return;

            if (!Array.isArray(value)) return 'FORMAT_ERROR';

            outputArr.push(uniq(value));
        };
    },
    password() {
        return value => {
            if (!value) return;
            if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\S]{6,}$/.test(value))) return 'NOT_ALLOWED_PASSWORD';
        };
    },
    not_equal_to_field(field) {
        return (value, params) => {
            if (livrUtils.isNoValue(value)) return;
            if (!livrUtils.isPrimitiveValue(value)) return 'FORMAT_ERROR';

            if (value === params[field]) return 'FIELDS_EQUAL';

            return;
        };
    },
    not(notAllowedValue) {
        return (value, params, outputArr) => {
            if (value !== notAllowedValue) {
                outputArr.push(value);

                return;
            }

            return 'NOT_ALLOWED_VALUE';
        };
    },
    equal(allowedAValue) {
        return (value, params, outputArr) => {
            if (value !== allowedAValue) {
                return 'NOT_ALLOWED_VALUE';
            }

            outputArr.push(value);
        };
    },
    gte_than_field(field) {
        return (value, params) => {
            if (livrUtils.isNoValue(value)) return;
            if (!livrUtils.isPrimitiveValue(value)) return 'FORMAT_ERROR';

            if (value < params[field]) return 'TOO_LOW';

            return;
        };
    },
    list_min_length(minLength) {
        return (value, params, outputArr) => {
            if (livrUtils.isNoValue(value)) return;
            if (!Array.isArray(value)) return 'FORMAT_ERROR';
            if (value.length < minLength) return 'TOO_SHORT';
            outputArr.push(value);
        };
    },
    phone() {
        const phoneRegex = /^\+[0-9]{8,15}$/;

        return value => {
            if (livrUtils.isNoValue(value)) return;
            if (!livrUtils.isPrimitiveValue(value)) return 'FORMAT_ERROR';
            if (!phoneRegex.test(value)) return 'WRONG_PHONE';
        };
    }
};

LIVR.Validator.registerDefaultRules(defaultRules);
