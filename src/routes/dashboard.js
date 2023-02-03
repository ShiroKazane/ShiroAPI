const express = require('express');
const router = new express.Router();
const googleAuth = require('../middleware/googleAuth');

router.get('/', googleAuth, (req, res) => {
	const username = req.user.displayName;
	const email = req.user._json.email;
	const id = req.user.id;
	var avatarURL = req.user._json.picture;
	avatarURL = avatarURL.replace(/=s96-c/g, '?rel=0');
	res.render('dashboard', {
		avatar: avatarURL,
		username,
		email,
        id
	});
});


module.exports = router;