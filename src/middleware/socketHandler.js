const Chat = require('../models/chats');
const timeAgo = require('./timeAgo');
let io;

function initializeSocket(ioInit) {
    io = ioInit;
    const emitChatHistory = async () => {
        try {
            const messages = await Chat.find().sort({ timestamp: -1 }).limit(20).exec();
            const dateOrAgo = messages.map((message) => ({
                ...message.toObject(),
                time: timeAgo(message.timestamp),
            }));
            io.emit('history', dateOrAgo.reverse());
        } catch (err) {
            console.error('Error fetching and emitting chat history:', err);
        }
    };

    io.on('connection', (socket) => {
        emitChatHistory();
        const chatStream = Chat.watch().on('change', (data) => { if (data.operationType === 'replace') emitChatHistory() });

        socket.on('message', (data) => {
            const { id, username, avatar, message } = data;
            
            const msg = new Chat({ id, username, avatar, message });
            msg.save((err) => {
                if (err) throw err;
            })

            const chat = { id: msg.id, username: msg.username, avatar: msg.avatar, message: msg.message, _id: msg._id.toString() }

            socket.broadcast.emit('message', chat);
        });

        socket.on('disconnect', async () => {
            await chatStream.close();
        })

        socket.on('console', (data) => {
            io.emit('console', data);
        });
    });
}

function emit(event, data) {
    if (io) {
        io.emit(event, data);
    } else {
        console.error('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, emit };
