import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserInviteStatusSchema } from '../util/userInviteStatus.interface.js';
const EventSchema = new Schema({
    creator: { type: ObjectId, required: true, ref: 'Users' },
    eventName: { type: String, required: true },
    location: { type: String, required: true },
    eventTime: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    imageUrl: { type: String, default: null },
    subject: { type: String, default: null },
    invitees: [{ type: UserInviteStatusSchema, required: true }]
});
const EventModel = model('Events', EventSchema);
export { EventModel };
//# sourceMappingURL=event.model.js.map