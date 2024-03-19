const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User = require('../models/users');
const Request = require('../models/requests');
const googleAuth = require('../middleware/googleAuth');
const timeAgo = require('../middleware/timeAgo');
const apiFolder = fs.readdirSync('./src/public').filter((dir) => !/(^|\/)\_[^\/\_]/g.test(dir));

router.get('/', googleAuth, async (req, res) => {
	const {
		displayName: username,
		_json: { email, picture },
		id
	} = req.user;

	const avatar = picture.replace(/=s96-c/g, '?rel=0');
	const url = req.originalUrl;

	let images = 0;
	const imageFolders = apiFolder
	for (const folder of imageFolders) {
		const imageFiles = fs.readdirSync(path.resolve('./src/public', folder)).filter((file) => file.endsWith('jpg') || file.endsWith('png') || file.endsWith('jpeg'));
		images += imageFiles.length;
	}

	const apis = apiFolder.length;

	const keys = await User.estimatedDocumentCount();

	const request = await Request.findById('63993c791dabad08e2597f57');

	const time = timeAgo();

	res.render('dashboard', { avatar, username, email, id, title: 'Dashboard', url, images, apis, keys, request: request.request, now: time });
});

router.get('/file', googleAuth, async (req, res) => {
	const {
        displayName: username,
        _json: { email, picture },
        id,
    } = req.user;

    const avatar = picture.replace(/=s96-c/g, '?rel=0');
	const url = req.originalUrl;

	let images = 0;
	const imageFolders = apiFolder
	for (const folder of imageFolders) {
		const imageFiles = fs.readdirSync(path.resolve('./src/public', folder)).filter((file) => file.endsWith('jpg') || file.endsWith('png') || file.endsWith('jpeg'));
		images += imageFiles.length;
	}

	const apis = apiFolder.length;

	const keys = await User.estimatedDocumentCount();

	const request = await Request.findById('63993c791dabad08e2597f57');

	const d = new Date();
	const now = d.toLocaleString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(',', '').toLocaleUpperCase();
	
	res.render('file', { avatar, username, email, id, title: 'File Manager', url, images, apis, keys, request: request.request, now });
})

module.exports = router;