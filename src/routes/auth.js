const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/users');
const masterToken = require('../middleware/masterToken');
const { whitelists } = require('../configs/whitelists.json');

router.get('/login', (req, res) => {
	try {
		if (!req.user || !whitelists.includes(req.user.id)) {
			return res.render('login');
		}

		res.status(200).redirect('/dashboard');
	} catch (err) {
		console.error(err);
		res.status(500).render('5xx/500');
	}
});


router.post('/signup', masterToken, async (req, res) => {
	try {
		const { username } = req.body;
		if (!username) {
			return res
				.status(400)
				.render('4xx/400', { message: 'This server request username.' });
		}

		const existingUser = await User.findOne({ username }).exec();
		if (existingUser) {
			return res
				.status(409)
				.render('4xx/409', { message: 'User already exist.' });
		}

		const userToken = { username };
		const token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET);
		const user = new User({
			_id: new mongoose.Types.ObjectId(),
			username,
			token
		});
		const result = await user.save();

		console.log(`${result.username}(${result.token})`);
		res
			.status(201)
			.render('2xx/201', { message: `${result.username}(${result.token})` });
	} catch (err) {
		console.error(err);
		res.status(500).render('5xx/500');
	}
});


router.delete('/delete', masterToken, async (req, res) => {
	try {
		const { username } = req.body;
		if (!username) {
			return res
				.status(400)
				.render('4xx/400', { message: 'This server request username.' });
		}

		const user = await User.findOneAndRemove({ username });
		if (!user) {
			return res.status(400).render('4xx/400', { message: 'User not found.' });
		}

		console.log(`${user.username}(${user.token}) has been deleted.`);
		res
			.status(200)
			.render('2xx/200', {
				message: `${user.username}(${user.token}) has been deleted.`
			});
	} catch (err) {
		console.error(err);
		res.status(500).render('5xx/500');
	}
});


router.get('/discord', (req, res, next) => {
	const { protocol, hostname } = req;
	const callbackURL = `${protocol}://${hostname}/auth/discord/callback`;
	passport.authenticate('discord', { callbackURL })(req, res, next);
});


router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/auth/login' }), function(req, res) {
	res.status(200).redirect('/dashboard');
});

module.exports = router;
