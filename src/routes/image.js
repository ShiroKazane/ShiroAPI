const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/:id', (req, res, next) => {
	let format = req.query.format;
	let download = req.query.download;
	const imageFolders = fs.readdirSync('./src/public');
	for (const folder of imageFolders) {
		const imageFiles = fs
			.readdirSync(`./src/public/${folder}`)
			.filter(
				(file) =>
					file.endsWith('jpg') || file.endsWith('png') || file.endsWith('jpeg')
			);
		for (let file of imageFiles) {
			if (file.slice(0, 15) === req.params.id) {
				const image = path.resolve(
					path.resolve(`./src/public/${folder}/${file}`)
				);
				if (download === 'true') return res.download(image, `${file}`);
				return res.sendFile(image);
			}
		}
	}
	res.status(404).render('4xx/404');
});

module.exports = router;
