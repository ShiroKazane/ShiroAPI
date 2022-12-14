const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		request: { type: Number, required: true }
	},
	{
		timestamps: {
			updatedAt: 'lastRequest'
		}
	}
);

module.exports = mongoose.model('requests', requestSchema);
