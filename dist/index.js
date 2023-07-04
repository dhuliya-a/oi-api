import express from 'express';
import { UsersController } from './controllers/users.controller.js';
import { ConnectionsController } from './controllers/connections.controller.js';
import { GroupsController } from './controllers/groups.controller.js';
import { EventsController } from './controllers/events.controller.js';
import { ChatMessageModel } from './models/chatMessage.model.js';
import { Server as socketIO } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
// import db from './config/mongo.js';
import mongoose from 'mongoose';
import { io as socketIOClient } from 'socket.io-client';
const app = express();
const port = process.env.PORT || 3000;
const username = 'pachizar_mongodb';
const password = 'Instagram@01';
const encodedPassword = encodeURIComponent(password);
const clusterName = 'cluster0.tljbuxq.mongodb.net';
const connectionString = `mongodb+srv://${username}:${encodedPassword}@${clusterName}/?retryWrites=true&w=majority`;
const usersController = new UsersController();
const connectionsController = new ConnectionsController();
const groupsController = new GroupsController();
const eventsController = new EventsController();
app.use(express.json());
app.use(cors());
app.use('/users', usersController.getRouter());
app.use('/connections', connectionsController.getRouter());
app.use('/groups', groupsController.getRouter());
app.use('/events', eventsController.getRouter());
app.listen(port, () => {
    console.log(process.env.PORT);
    console.log(`Server running at http://localhost:${port}`);
});
const server = createServer(app);
const io = new socketIO(server, { cors: { origin: "*" } });
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
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
// Remove the duplicate event listener for 'open' here
const socket = socketIOClient('http://localhost:3000');
socket.on('connect', () => {
    console.log('Connected to the Socket.IO server.');
    // Send a message to the server
    socket.emit('chat message', 'Hello from the client!');
});
socket.on('chat message', (message) => {
    console.log('Received message from the server:', message);
});
export { server };
//# sourceMappingURL=index.js.map