import { Server } from 'socket.io';
import { ChatMessageModel } from '../models/chatMessage.model.js';
export function startSocketServer(server) {
    const io = new Server(server);
    // Rest of the code
    // Socket.IO event handlers
    io.on('connection', (socket) => {
        console.log('A user connected');
        // Handle chat events
        socket.on('joinEventChat', (eventId) => {
            console.log('Join chat', eventId);
            socket.join(eventId);
        });
        socket.on('leaveEventChat', (eventId) => {
            console.log('Leave chat', eventId);
            socket.leave(eventId);
        });
        socket.on('newMessage', (data) => {
            console.log('New message', data.message);
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
}
//# sourceMappingURL=chatsHandler.js.map