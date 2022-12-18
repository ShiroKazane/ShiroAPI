const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		return res.status(401).render('4xx/401');
	}

	jwt.verify(token, process.env.MASTER_TOKEN_SECRET, (err, user) => {
		if (err) {
			return res.status(403).render('4xx/403');
		}

		req.user = user;
		next();
	});
};
