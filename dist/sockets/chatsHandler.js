import { ChatMessageModel } from '../models/chatMessage.model.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import server from '../index.js';
const io = new Server(createServer(server));
// Socket.IO event handlers
io.on('connection', (socket) => {
    console.log('A user connected');
    // Handle chat events
    socket.on('joinEventChat', (eventId) => {
        socket.join(eventId);
    });
    socket.on('leaveEventChat', (eventId) => {
        socket.leave(eventId);
    });
    socket.on('newMessage', (data) => {
        // Save the message to the database
        const newMessage = new ChatMessageModel({
            eventId: data.eventId,
            senderId: data.senderId,
            senderUserName: data.senderUserName,
            message: data.message,
            createdAt: new Date(),
        });
        newMessage.save();
        // Emit the message to all users in the event chat room
        io.to(data.eventId).emit('message', newMessage);
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
module.exports = io;
//# sourceMappingURL=chatsHandler.js.map