require('dotenv').config();
require('https').globalAgent.options.rejectUnauthorized = false;
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const serveIndex = require('serve-index');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const color = require('cli-color');
const Table = require('cli-table');
const rimraf = require('rimraf');
const toProperCase = require('./middleware/toProperCase');
const discordAuth = require('./middleware/discordAuth');
const passport = require('passport');
const session = require('express-session');
const DiscordStrategy = require('passport-discord').Strategy;
const app = express();
ejs.delimiter = '?';

if (!fs.existsSync('./src/temp')) {
	fs.mkdirSync('./src/temp', { recursive: true });
}

app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(favicon('./src/assets/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('src/public', { index: false, extensions: ['jpg', 'png', 'jpeg'] }));
passport.use(new DiscordStrategy({ clientID: process.env.DISCORD_CLIENT_ID, clientSecret: process.env.DISCORD_CLIENT_SECRET, callbackURL: '/auth/discord/callback', scope: ['identify'] }, function (accessToken, refreshToken, profile, cb) {
	return cb(null, profile);
}));
app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false }));
passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (user, done) {
	done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());
app.use('/_dir', discordAuth, express.static('src/public'), serveIndex('src/public', { icons: true, hidden: true, view: 'details', stylesheet: 'src/assets/directory.css' }));

const routeFiles = fs
	.readdirSync(`./src/routes`)
	.filter((file) => file.endsWith('js'));
for (const file of routeFiles) {
	const routes = require(`./routes/${file}`);
	app.use(`/${file.split('.')[0]}`, routes);
}

app.get('/', (req, res, next) => {
	res.render('index');
});

app.all('*', (req, res, next) => {
	res.status(404).render('4xx/404');
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

const table = new Table({
	head: [color.green('API'), color.green('Amount')],
	colWidths: [9, 9],
	style: { compact: true, 'padding-left': 1 }
});

const apiFolders = fs
	.readdirSync('./src/public')
	.filter((dir) => !/(^|\/)\_[^\/\_]/g.test(dir));
for (const folder of apiFolders) {
	const files = fs
		.readdirSync(`./src/public/${folder}`)
		.filter(
			(file) =>
				file.endsWith('jpg') || file.endsWith('png') || file.endsWith('jpeg')
		);
	table.push([toProperCase(folder), files.length]);
}
console.info(table.toString());

setInterval(() => {
	fs.readdir('./src/temp', function (err, files) {
		if (!files[0]) return;
		files.forEach(function (file, index) {
			fs.stat(path.join('./src/temp', file), function (err, stat) {
				var end, now;
				if (err) {
					return console.error(err);
				}
				now = new Date().getTime();
				end = new Date(stat.ctime).getTime() + 3600000;
				if (now > end) {
					return rimraf(path.join('./src/temp', file), function (err) {
						if (err) {
							return console.error('[ERROR]', err);
						}
					});
				}
			});
		});
	});
}, 60000);

module.exports = app;
