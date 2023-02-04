const express = require('express');
const router = express.Router();
const googleAuth = require('../middleware/googleAuth');

router.get('/', googleAuth, (req, res) => {
	const {
		displayName: username,
		_json: { email, picture },
		id
	} = req.user;
	const avatar = picture.replace(/=s96-c/g, '?rel=0');

	res.render('dashboard', { avatar, username, email, id });
});

module.exports = router;