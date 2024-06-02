export function generateIds(n) {
    const ids = [];

    for (let i = 0; i < n; ++i) { // eslint-disable-line
        let id = generateId();

        if (ids.includes(id)) {
            while (ids.includes(id)) id = generateId();
        }

        ids.push(id);
    }

    return ids;
}

export function generateId() {
    const timestamp = `${Date.now()}`.slice(0, -3);

    return +`${timestamp}${getRandomInt(100000, 999999)}`;
}

function getRandomInt(min, max) {
    const minBorder = Math.ceil(min);
    const maxBorder = Math.floor(max);

    return Math.floor(Math.random() * (maxBorder - minBorder)) + minBorder;
}

export const asyncCallWithTimeout = async (asyncPromise, timeLimit) => {
    let timeoutHandle;

    const timeoutPromise = new Promise((_resolve, reject) => {
        timeoutHandle = setTimeout(
            () => reject(new Error('Async call timeout limit reached')),
            timeLimit
        );
    });

    return Promise.race([ asyncPromise, timeoutPromise ]).then(result => { // eslint-disable-line more/no-then
        clearTimeout(timeoutHandle);

        return result;
    });
};

export function splitArrayIntoPortions(array, portionSize, strict = false) {
    const portions = [];

    // eslint-disable-next-line more/no-c-like-loops
    for (let x = 0; x < array.length; x += portionSize) {
        const portion = array.slice(x, x + portionSize);

        if (strict && portion.length < portionSize) continue;

        portions.push(portion);
    }

    return portions;
}
