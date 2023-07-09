import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
const UserDetailsSchema = new Schema({
    userId: { type: ObjectId, required: true, ref: 'Users' },
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    imageUrl: { type: String, default: null }
}, { _id: false });
export { UserDetailsSchema };
//# sourceMappingURL=userDetails.interface.js.map