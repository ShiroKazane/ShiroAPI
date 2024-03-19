const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('chats', chatSchema);
