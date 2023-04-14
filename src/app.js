require('dotenv').config();
require('https').globalAgent.options.rejectUnauthorized = false;

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const serveIndex = require('serve-index');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const color = require('cli-color');
const Table = require('cli-table');
const rimraf = require('rimraf');
const crypto = require('crypto');
const { exec } = require('child_process');
const toProperCase = require('./middleware/toProperCase');
const googleAuth = require('./middleware/googleAuth');
const { logs } = require('./configs/logs.json');

const app = express();
ejs.delimiter = '?';

if (!fs.existsSync('./src/temp')) {
	fs.mkdirSync('./src/temp', { recursive: true });
}

function setupAuth() {
	passport.use(new GoogleStrategy({ clientID: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, callbackURL: `${process.env.CALLBACK_URL ? process.env.CALLBACK_URL : 'http://localhost'}/auth/google/callback`, scope: ['profile', 'email'] }, (accessToken, refreshToken, profile, cb) => {
		return cb(null, profile);
	}));
	
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function (user, done) {
		done(null, user);
	});
	passport.deserializeUser(function (user, done) {
		done(null, user);
	});
}

app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(favicon('./src/assets/favicon.ico'));
app.use(morgan('dev', {
	skip: (req, res) => logs.includes(req.path)
}));
app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false, maxAge: null }));
app.use(passport.authenticate('session'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

setupAuth();

app.use(express.static('src/public', { index: false, extensions: ['jpg', 'png', 'jpeg'] }));
app.use('/_dir', googleAuth, express.static('src/public'), serveIndex('src/public', { icons: true, hidden: true, view: 'details', stylesheet: 'src/assets/directory.css' }));

const routeFiles = fs
	.readdirSync(`./src/routes`)
	.filter((file) => file.endsWith('js'));
for (const file of routeFiles) {
	const routes = require(`./routes/${file}`);
	app.use(`/${file.split('.')[0]}`, routes);
}

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/discord', (req, res) => {
	res.redirect('https://discord.gg/WXFAVApEw9');
});

app.post('/payload', (req, res) => {
	const signature = req.headers['x-hub-signature'];
	if (!signature) {
		return res.status(400).render('4xx/400', {
			message: 'Missing X-Hub-Signature header'
		})
	}

	const hmac = crypto.createHmac('sha1', process.env.SECRET_KEY);
	hmac.update(JSON.stringify(req.body));
	const computedSignature = `sha1=${hmac.digest('hex')}`;

	if (computedSignature !== signature) {
		return res.status(401).render('4xx/401');
	}

	res.sendStatus(200);

	exec('git pull', (error, stdout, stderr) => {
		if (error) {
			return console.error(error);
		}

		console.log(stdout);
		console.log(stderr);
	});
});

app.all('*', (req, res) => {
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
	console.error(color.red('[ERROR]'), 'DATABASE', color.red('An error occured with the database connection:\n'), err);
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
