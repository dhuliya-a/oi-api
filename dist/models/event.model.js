import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { StatusEnum } from './connection.model.js';
const UserInviteStatusSchema = new Schema({
    userId: { type: ObjectId, required: true, ref: 'Users' },
    visited: { type: Boolean, required: true, default: false },
    status: { type: String, required: true, default: StatusEnum.PENDING }
});
const EventSchema = new Schema({
    creator: { type: ObjectId, required: true, ref: 'Users' },
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    eventTime: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    imageUrl: { type: String },
    invitees: [{ type: UserInviteStatusSchema, required: true }]
});
const EventModel = model('Events', EventSchema);
export { EventModel };
//# sourceMappingURL=event.model.js.map