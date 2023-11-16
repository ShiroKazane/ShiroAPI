const { whitelists } = require('../configs/whitelists.json');

module.exports = (req, res, next) => {
	if (!req.user) return res.status(401).redirect('/auth/login');

	if (!whitelists.includes(req.user.id)) {
		return res.status(401).render('4xx/401');
	}

	next();
};