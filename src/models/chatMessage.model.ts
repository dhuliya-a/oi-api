import {Schema, model, Document} from 'mongoose';
import {ObjectId} from 'mongodb';

interface IChatMessage extends Document {
  eventId: ObjectId,
  senderId: ObjectId,
  senderUserName: string,
  message: string,
  createdAt: Date,
}

const ChatMessageSchema = new Schema<IChatMessage>({
  createdAt: {type: Date, required: true},
  senderId: {type: ObjectId, required: true, ref: 'Users'},
  senderUserName: {type: String, required: true},
  eventId: {type: ObjectId, required: true},
  message: {type: String, required: true}
})

const ChatMessageModel = model<IChatMessage>('Messages', ChatMessageSchema);

export {ChatMessageModel, IChatMessage};