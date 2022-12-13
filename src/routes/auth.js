const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const authToken = require('../middleware/authToken');
const masterToken = require('../middleware/masterToken');

router.get('/login', authToken, (req, res, next) => {
	let url = req.query.url;
	if (url) return res.status(200).redirect(url);
	res.status(200).render('2xx/200', {
		message: 'Authorization valid.'
	});
});

router.post('/signup', masterToken, (req, res, next) => {
	let username = req.body.username;
	if (!username)
		return res.status(400).render('4xx/400', {
			message: 'This server request username.'
		});
	User.findOne({ username: username })
		.exec()
		.then((user) => {
			if (user) {
				return res.status(409).render('4xx/409', {
					message: 'User already exist.'
				});
			} else {
				const userToken = { username: username };
				const token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET);
				const user = new User({
					_id: new mongoose.Types.ObjectId(),
					username: username,
					token: token
				});
				user
					.save()
					.then((result) => {
						console.log(`${result.username}(${result.token})`);
						res.status(201).render('2xx/201', {
							message: `${result.username}(${result.token})`
						});
					})
					.catch((err) => {
						console.log(err);
						res.status(500).render('5xx/500');
					});
			}
		});
});

router.delete('/delete', masterToken, (req, res, next) => {
	let username = req.body.username;
	if (!username)
		return res.status(400).render('4xx/400', {
			message: 'This server request username.'
		});
	try {
		User.findOneAndRemove({ username: username }, function (err, docs) {
			if (docs === null || err)
				return res.status(400).render('4xx/400', {
					message: 'User not found.'
				});
			console.log(`${docs.username}(${docs.token}) has been deleted.`);
			res.status(200).render('2xx/200', {
				message: `${docs.username}(${docs.token}) has been deleted.`
			});
		});
	} catch (err) {
		console.log(err);
		res.status(500).render('5xx/500');
	}
});

module.exports = router;
