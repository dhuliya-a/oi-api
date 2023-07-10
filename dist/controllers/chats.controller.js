import { Router } from 'express';
import { ChatMessageModel } from '../models/chatMessage.model.js';
import { EventModel } from '../models/event.model.js';
export class ChatsController {
    constructor() {
        this.getChatMessages = async (req, res) => {
            try {
                const { eventId } = req.params;
                const event = await EventModel.findById(eventId).sort({ createdAt: 1 });
                ;
                if (!event) {
                    return res.status(404).json({ message: 'Event not found.' });
                }
                const messages = await ChatMessageModel.find({ eventId: eventId });
                res.status(200).json(messages);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to fetch messages.' });
            }
        };
        this.router = Router();
        this.initiateRoutes();
    }
    getRouter() {
        return this.router;
    }
    initiateRoutes() {
        this.router.get('/:eventId', this.getChatMessages);
    }
}
//# sourceMappingURL=chats.controller.js.map