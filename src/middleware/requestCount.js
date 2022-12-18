const Request = require('../models/requests');

module.exports = async (next) => {
	await Request.findByIdAndUpdate(
		'63993c791dabad08e2597f57',
		{
			$inc: { request: 1 }
		},
		{ new: true }
	).exec();
	next();
};
