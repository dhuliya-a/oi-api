import {Schema, model, Document} from 'mongoose';
import {ObjectId} from 'mongodb';
import StatusEnum from '../util/statusEnum.js';
import { UserInviteStatus, UserInviteStatusSchema } from '../util/userInviteStatus.interface.js';
import { UserDetails, UserDetailsSchema } from '../util/userDetails.interface.js';

interface IEvent extends Document {
  creator: ObjectId;
  eventName: string;
  location: string;
  eventTime: Date;
  createdAt: Date;
  imageUrl: string;
  subject: string;
  invitees: UserInviteStatus[];
}

const EventSchema = new Schema<IEvent>({
  creator: { type: ObjectId, required: true, ref: 'Users' },
  eventName: { type: String, required: true },
  location: { type: String, required: true },
  eventTime: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  imageUrl: { type: String, default: null },
  subject: { type: String, default: null },
  invitees: [{ type: UserInviteStatusSchema, required: true }]
});

const EventModel = model<IEvent>('Events', EventSchema);

export { EventModel, IEvent, UserInviteStatus };