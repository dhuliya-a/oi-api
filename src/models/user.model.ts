import { Schema, Document, model } from 'mongoose';
import {ObjectId} from 'mongodb';

interface IUser extends Document {
  emailId: string;
  password: string;
  userName: string;
  imageUrl: string;
  fullName: string;
  // unreadEvents: ObjectId[];
}

const UserSchema = new Schema<IUser>({
  emailId: { type: String, required: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  imageUrl: { type: String, default: null },
  fullName: { type: String, required: true }
  // unreadEvents: [{ type: ObjectId, ref: 'Events', required: true, default: [] }]
});

const UserModel = model<IUser>('Users', UserSchema);

export {UserModel, IUser};
