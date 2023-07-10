import {Schema, model, Document} from 'mongoose';
import {ObjectId} from 'mongodb';
import { StatusEnum } from '../models/connection.model.js';
import { UserDetails, UserDetailsSchema } from './userDetails.interface.js';

interface UserInviteStatus {
  userDetails: UserDetails;
  status: string;
}

const UserInviteStatusSchema = new Schema<UserInviteStatus>({
  userDetails: { type: UserDetailsSchema, required: true},
  status: { type: String, required: true, default: StatusEnum.PENDING }
},
{ _id: false });

export {UserInviteStatus, UserInviteStatusSchema}