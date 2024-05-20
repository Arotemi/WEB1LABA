import jsonRefs from 'json-refs';

export default async function swagger(path) {
    const { resolved } = await jsonRefs.resolveRefsAt(path);

    return resolved;
}
