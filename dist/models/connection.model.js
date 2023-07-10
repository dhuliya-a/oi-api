import { Schema, model } from 'mongoose';
import { ObjectId } from 'mongodb';
import StatusEnum from '../util/statusEnum.js';
const ConnectionSchema = new Schema({
    user1: { type: ObjectId, required: true, ref: 'Users' },
    user2: { type: ObjectId, required: true, ref: 'Users' },
    status: { type: String, enum: Object.values(StatusEnum), required: true, default: StatusEnum.PENDING },
    createdAt: { type: Date, required: true }
});
const ConnectionModel = model('Connections', ConnectionSchema);
export { ConnectionModel, StatusEnum };
//# sourceMappingURL=connection.model.js.map