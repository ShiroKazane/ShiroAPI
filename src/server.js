require('https').globalAgent.options.rejectUnauthorized = false;

const { createServer } = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const socketHandler = require('./middleware/socketHandler');
const { green } = require('cli-color');

const PORT = process.env.PORT || 80;

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5500', 'http://api.shirokazane.my.id:5500']
	}
});

socketHandler.initializeSocket(io);

server.listen(PORT, () => {
	console.info('[INFO]', green(`Express is running on PORT: ${PORT}`));
});