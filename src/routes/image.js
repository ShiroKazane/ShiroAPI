const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const formatImage = require('../middleware/formatImage');

const extensions = ['jpeg', 'jpg', 'webp', 'png'];
const publicDirectory = './src/public';
const tempDirectory = './src/temp';

router.get('/:id', async (req, res) => {
	const { format, download } = req.query;
	const { id } = req.params;

	const imageFolders = fs.readdirSync(publicDirectory);
	for (const folder of imageFolders) {
		const imageFiles = fs
			.readdirSync(path.resolve(publicDirectory, folder))
			.filter((file) => extensions.some((ext) => file.endsWith(ext)));

		for (const file of imageFiles) {
			const imagePath = path.resolve(publicDirectory, folder, file);
			const tempPath = path.resolve(tempDirectory, `${id}.${format}`);
			if (id === file) {
				return res.sendFile(imagePath);
			}
			const [fileId, fileExtension] = file.split('.');
			if (fileId === id) {
				if (download === 'true') {
					return res.download(imagePath, file);
				}
				if (format && fileExtension !== format) {
					if (fs.existsSync(tempPath)) {
						return res.sendFile(tempPath);
					}
					if (!extensions.includes(format)) {
						return res.status(404).render('4xx/404');
					}
					await formatImage(imagePath, format, tempPath);
					return res.sendFile(tempPath);
				}
				return res.sendFile(imagePath);
			}
		}
	}

	res.status(404).render('4xx/404');
});

module.exports = router;
