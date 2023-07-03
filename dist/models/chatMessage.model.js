import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';
const ChatMessageSchema = new Schema({
    createdAt: { type: Date, required: true },
    senderId: { type: ObjectId, required: true, ref: 'Users' },
    senderUserName: { type: String, required: true },
    eventId: { type: ObjectId, required: true },
    message: { type: String, required: true }
});
const ChatMessageModel = model('Messages', ChatMessageSchema);
export { ChatMessageModel };
//# sourceMappingURL=chatMessage.model.js.map