async function sleep(timeout = 1000) {
    return new Promise(res => setTimeout(() => {
        res();
    }, timeout));
}

export default sleep;
