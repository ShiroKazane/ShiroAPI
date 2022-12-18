const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const formatImage = require('../middleware/formatImage');
const extensions = ['jpeg', 'jpg', 'webp', 'png'];

router.get('/:id', async (req, res) => {
	const { format, download } = req.query;
	const imageFolders = fs.readdirSync('./src/public');

	for (const folder of imageFolders) {
		const imageFiles = fs
			.readdirSync(`./src/public/${folder}`)
			.filter((file) => extensions.some((ext) => file.endsWith(ext)));

		for (let file of imageFiles) {
			if ( file.slice(0, 15) === req.params.id || file.slice(0, 15) === req.params.id.slice(0, 15)) {
				const image = path.resolve(path.resolve(`./src/public/${folder}/${file}`));
				const temp = path.resolve(`./src/temp/${file.slice(0, 15)}.${format}`);
				if (download === 'true') {
					return res.download(image, `${file}`);
				}
				if (format && format !== file.slice(16)) {
					if (fs.existsSync(temp)) {
						return res.sendFile(temp);
					}
					if (!extensions.includes(format)) {
						return res.status(404).render('4xx/404');
					}
					await formatImage(image, format, temp);
					return res.sendFile(temp);
				}
				return res.sendFile(image);
			}
		}
	}

	res.status(404).render('4xx/404');
});

module.exports = router;
