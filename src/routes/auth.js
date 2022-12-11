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
	res.sendStatus(200);
});

router.post('/signup', masterToken, (req, res, next) => {
	User.findOne({ username: req.body.username })
		.exec()
		.then((user) => {
			if (user) {
				return res.status(409).json({
					message: 'User Exist.',
				});
			} else {
				const userToken = { username: req.body.username };
				const token = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET);
				const user = new User({
					_id: new mongoose.Types.ObjectId(),
					username: req.body.username,
					token: token,
				});
				user
					.save()
					.then((result) => {
						console.log(result);
						res.status(201).json({
							message: 'User Created.',
						});
					})
					.catch((err) => {
						console.log(err);
						res.status(500).json({
							error: err,
						});
					});
			}
		});
});

router.delete('/:username', masterToken, (req, res, next) => {
	let username = req.params.username;
	User.findOneAndDelete({ username: username });
});

module.exports = router;
