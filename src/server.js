require('https').globalAgent.options.rejectUnauthorized = false;

const http = require('http');
const app = require('./app');
const { green } = require('cli-color');

const PORT = process.env.PORT || 80;

const server = http.createServer(app);

server.listen(PORT, () => {
	console.info('[INFO]', green(`Express is running on PORT: ${PORT}`));
});
