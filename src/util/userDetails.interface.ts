import {Schema, model, Document} from 'mongoose';
import {ObjectId} from 'mongodb';
import { StatusEnum } from '../models/connection.model.js';

interface UserDetails {
  userName:  string,
  fullName: string,
  userId: ObjectId;
  imageUrl: string;
}

const UserDetailsSchema = new Schema<UserDetails>({
  userId: { type: ObjectId, required: true, ref: 'Users' },
  fullName: { type: String, required: true },
  userName: { type: String, required: true },
  imageUrl: { type: String, default: null }
},
{ _id: false });

export {UserDetails, UserDetailsSchema}