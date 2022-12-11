const http = require('http');
const app = require('./app');
const color = require('cli-color');

const PORT = process.env.PORT || 80;

const server = http.createServer(app);

server.listen(PORT, () => {
	console.info('[INFO]', color.green('Express is running on PORT:', PORT));
});
