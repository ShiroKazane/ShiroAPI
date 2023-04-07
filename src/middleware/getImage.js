const { promises: fs } = require('fs');
const fetch = require('node-fetch');

module.exports = async (url, path) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    await fs.writeFile(path, buffer);
};
