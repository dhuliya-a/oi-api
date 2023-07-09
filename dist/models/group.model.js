import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UserDetailsSchema } from '../util/userDetails.interface.js';
const GroupSchema = new Schema({
    creator: { type: ObjectId, required: true, ref: 'Users' },
    groupName: { type: String, required: true },
    createdAt: { type: Date, required: true },
    imageUrl: { type: String, default: null },
    subject: { type: String, default: null },
    //TODO - Look into the default value
    members: [{ type: UserDetailsSchema, required: true, default: [] }]
});
const GroupModel = model('Groups', GroupSchema);
export { GroupModel };
//# sourceMappingURL=group.model.js.map