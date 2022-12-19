const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authToken = require('../middleware/authToken');
const requestCount = require('../middleware/requestCount');

router.get('/', (req, res) => {
	try {
		const directories = fs.readdirSync('./src/public');
		const list = directories.filter((dir) => !/(^|\/)\_[^\/\_]/g.test(dir));

		res.status(200).json(list)
	} catch (err) {
		console.error(err);
		res.status(500).render('5xx/500');
	}
});


router.get('/:id', authToken, requestCount, async (req, res) => {
	try {
		const param = `./src/public/${req.params.id}`;
		if (!fs.existsSync(param)) {
			return res.status(404).render('4xx/404');
		}

		const files = fs.readdirSync(param);
		const index = Math.floor(Math.random() * files.length);
		const [fileName] = files[index].split('.');
		const fileExt = path.extname(files[index]).slice(1);
		const imageUrl = `http://${req.hostname}/image/${fileName}?format=${fileExt}`;

		res.status(200).json({ url: imageUrl });
	} catch (err) {
		console.error(err);
		res.status(500).render('5xx/500');
	}
});


module.exports = router;
