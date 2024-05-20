export function dumpContext(user, useragent) {
    return {
        userId : user.id,
        useragent
    };
}

export function dumpUser(user) {
    return {
        id        : user.id,
        name      : user.name,
        gender    : user.gender,
        email     : user.email,
        birthDate : user.birthDate
    };
}

