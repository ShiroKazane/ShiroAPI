require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const serveIndex = require('serve-index');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const color = require('cli-color');
const rimraf = require('rimraf');
const app = express();

app.set('view engine', 'ejs');
app.use(favicon('./src/assets/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	express.static('src/public', {
		index: false,
		extensions: ['jpg', 'png', 'jpeg']
	})
);
app.use(
	'/_dir',
	express.static('src/public'),
	serveIndex('src/public', { icons: true, hidden: true, view: 'details' })
);

const routeFiles = fs
	.readdirSync(`./src/routes`)
	.filter((file) => file.endsWith('js'));
for (const file of routeFiles) {
	const routes = require(`./routes/${file}`);
	app.use(`/${file.split('.')[0]}`, routes);
}

app.all('*', (req, res, next) => {
	res.sendStatus(404);
});

mongoose.connection.on('connected', () => {
	console.info('[INFO] DATABASE', color.green('Connected.'));
});

mongoose.connection.on('connecting', () => {
	console.info('[INFO] DATABASE', color.yellow('Connecting...'));
});

mongoose.connection.on('disconnected', () => {
	console.info('[INFO] DATABASE', color.red('Disconnected.'));
});

mongoose.connection.on('err', (err) => {
	console.error(
		color.red('[ERROR]'),
		'DATABASE',
		color.red('An error occured with the database connection:\n'),
		err
	);
});

(async () => {
	await mongoose
		.connect(process.env.MONGO_URI)
		.catch((err) => console.error('[ERROR]', err));
})();

setInterval(() => {
	if (!fs.existsSync('./src/temp')) {
		fs.mkdirSync('./src/temp', { recursive: true });
		console.info('[INFO] TEMP', color.yellow('Folder Created.'));
	}
	fs.readdir('./src/temp', function (err, files) {
		if (!files[0]) return;
		files.forEach(function (file, index) {
			fs.stat(path.join('./src/temp', file), function (err, stat) {
				var endTime, now;
				if (err) {
					return console.error(err);
				}
				now = new Date().getTime();
				endTime = new Date(stat.ctime).getTime() + 5;
				if (now > endTime) {
					return rimraf(path.join('./src/temp', file), function (err) {
						if (err) {
							return console.error(err);
						}
					});
				}
			});
		});
		console.info('[INFO] TEMP', color.yellow('Image Deleted.'));
	});
}, 150000);

module.exports = app;
