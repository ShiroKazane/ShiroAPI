const express = require('express');
const router = new express.Router();
const discordAuth = require('../middleware/discordAuth');

router.get('/', discordAuth, (req, res) => {
	const { id, avatar, username, discriminator } = req.user;
	const avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg?size=512`;
	res.render('dashboard', {
		avatar: avatarURL,
        discriminator,
		username,
        id
	});
});


module.exports = router;