import { Schema, model } from 'mongoose';
const UserSchema = new Schema({
    emailId: { type: String, required: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    imageUrl: { type: String, default: null },
    fullName: { type: String, required: true }
    // unreadEvents: [{ type: ObjectId, ref: 'Events', required: true, default: [] }]
});
const UserModel = model('Users', UserSchema);
export { UserModel };
//# sourceMappingURL=user.model.js.map