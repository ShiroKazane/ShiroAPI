const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authToken = require('../middleware/authToken');
const requestCount = require('../middleware/requestCount');

router.get('/', (req, res, next) => {
	const list = fs
		.readdirSync('./src/public')
		.filter((dir) => !/(^|\/)\.[^\/\.]/g.test(dir));
	res.status(200).json(list);
});

router.get('/:id', authToken, requestCount, (req, res, next) => {
	let param = './src/public/' + req.params.id;
	if (fs.existsSync(param)) {
		let requiredCount = 1;
		let files = fs.readdirSync(param);

		while (requiredCount-- && files.length) {
			let length = files.length;
			let index = Math.floor(Math.random() * length);
			let result = files.splice(index, 1);
			res.status(200).json({
				url:
					'http://' +
					req.hostname +
					'/image/' +
					result.toString().split('.')[0] +
					'?format=' +
					path.extname(result.toString()).slice(1)
			});
		}
	} else {
		res.status(404).render('4xx/404');
	}
});

module.exports = router;
