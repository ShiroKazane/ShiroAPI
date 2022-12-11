const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const masterToken = require('../middleware/masterToken');
const randomString = require('../middleware/randomString');

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './src/temp');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
let upload = multer({ storage: storage });

router.post('/:id', masterToken, upload.single('image'), (req, res, next) => {
	if (!req.file && !req.file.path) return res.sendStatus(400);
	let compressedImage = path.join(`./src/public/${req.params.id}/${randomString()}${path.extname(req.file.path)}`);
	sharp(req.file.path).jpeg().toFile(compressedImage);
	res.status(200).json({
		url: `http://${req.hostname}/image/${compressedImage.slice(16)}`
	});
});

module.exports = router;
