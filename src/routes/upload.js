const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const masterToken = require('../middleware/masterToken');
const randomString = require('../middleware/randomString');
const googleAuth = require('../middleware/googleAuth');
const toProperCase = require('../middleware/toProperCase');

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './src/temp');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
let upload = multer({ storage: storage });

router.get('/', googleAuth, (req, res, next) => {
	const directories = fs.readdirSync('./src/public');
	const content = toProperCase(JSON.stringify(directories));
	res.status(200).render('upload-list', {
		content
	})
})

router.get('/:id', googleAuth, upload.single('image'), (req, res, next) => {
	const dest = path.resolve(`./src/public/${req.params.id}`);
	if (!fs.existsSync(dest)) {
		return res.status(404).render('4xx/404');
	}
	const params = { value: req.params.id };
	if (params.value.includes('_')) {
		params.value += '*';
		params.value = params.value.replace(/_/g, '');
	}
	res.render('upload', {
		title: `Upload ${toProperCase(params.value)}`,
		url: req.originalUrl,
		token: process.env.SHIRO_API_KEY
	});
})

router.post('/:id', masterToken, upload.single('image'), (req, res, next) => {
	const dest =  path.resolve(`./src/public/${req.params.id}`);
	if (!fs.existsSync(dest)) {
		return res.status(404).render('4xx/404')
	}
	let compress = req.query.compress;
	if (!req.file || !req.file.path)
		return res.status(400).render('4xx/400', {
			message: 'This server request file to be uploaded.'
		});
	let compressedImage = path.join(`./src/public/${req.params.id}/${randomString()}${path.extname(req.file.path)}`);
	if (compress === 'true') {
		sharp(req.file.path)
			.jpeg({
				quality: 80,
				chromaSubsampling: '4:4:4',
				force: false
			})
			.png({
				quality: 90,
				compressionLevel: 8,
				force: false
			})
			.toFile(compressedImage);
	} else {
		sharp(req.file.path)
			.jpeg({ quality: 100, force: false })
			.png({ compressionLevel: 9, force: false })
			.toFile(compressedImage);
	}
	res.status(200).json({
		url: `http://${req.hostname}/image/${compressedImage.slice(20).split('.')[0]}?format=${compressedImage.slice(21).split('.')[1]}`
	});
});

module.exports = router;
