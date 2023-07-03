import {Schema, model, Document} from 'mongoose';
import {ObjectId} from 'mongodb';
import { StatusEnum } from './connection.model.js';

interface UserInviteStatus {
  userId: ObjectId;
  visited: Boolean;
  status: string;
}

interface IEvent extends Document {
  creator: ObjectId;
  eventName: string;
  location: string;
  eventTime: Date;
  createdAt: Date;
  imageUrl: string;
  invitees: UserInviteStatus[];
}

const UserInviteStatusSchema = new Schema<UserInviteStatus>({
  userId: { type: ObjectId, required: true, ref: 'Users' },
  visited: {type: Boolean, required: true, default: false},
  status: { type: String, required: true, default: StatusEnum.PENDING }
});

const EventSchema = new Schema<IEvent>({
  creator: { type: ObjectId, required: true, ref: 'Users' },
  eventName: { type: String, required: true },
  location: { type: String, required: true },
  eventTime: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  imageUrl: { type: String },
  invitees: [{ type: UserInviteStatusSchema, required: true }]
});

const EventModel = model<IEvent>('Events', EventSchema);

export { EventModel, IEvent, UserInviteStatus };