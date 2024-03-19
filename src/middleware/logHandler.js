module.exports = (delay = 50, randomized = true) => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    return async (s) => {
        for (const c of s) {
            process.stdout.write(c);
            await sleep((randomized ? Math.random() : 1) * delay);
        }
        process.stdout.write('\n');
    }
};