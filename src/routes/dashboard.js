const express = require('express');
const router = new express.Router();
const discordAuth = require('../middleware/discordAuth');

router.get('/', discordAuth, (req, res) => {
	const { id, avatar, username, discriminator } = req.user;
	const avatarURL = avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.jpg?size=512` : 'https://cdn.discordapp.com/embed/avatars/0.png';
	res.render('dashboard', {
		avatar: avatarURL,
        discriminator,
		username,
        id
	});
});


module.exports = router;