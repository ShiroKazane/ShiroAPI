const { whitelists } = require('../whitelists.json');

module.exports = (req, res, next) => {
    if (!req.user) return res.redirect('/auth/login');
	if (whitelists.includes(req.user.id)) {
		next();
	} else {
		res.status(401).render('4xx/401');
	}
};
