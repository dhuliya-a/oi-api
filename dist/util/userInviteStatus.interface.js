import { Schema } from 'mongoose';
import { StatusEnum } from '../models/connection.model.js';
import { UserDetailsSchema } from './userDetails.interface.js';
const UserInviteStatusSchema = new Schema({
    userDetails: { type: UserDetailsSchema, required: true },
    status: { type: String, required: true, default: StatusEnum.PENDING }
}, { _id: false });
export { UserInviteStatusSchema };
//# sourceMappingURL=userInviteStatus.interface.js.map