import { Schema, Document, model } from 'mongoose';
import { ObjectId } from 'mongodb';
import StatusEnum from '../util/statusEnum.js';

interface IConnection extends Document {
  user1: ObjectId,
  user2: ObjectId,
  status: string,
  createdAt: Date
}

const ConnectionSchema = new Schema<IConnection>({
  user1: { type: ObjectId, required: true, ref: 'Users' },
  user2: { type: ObjectId, required: true, ref: 'Users' },
  status: { type: String, enum: Object.values(StatusEnum), required: true, default: StatusEnum.PENDING },
  createdAt: { type: Date, required: true }
});

const ConnectionModel = model<IConnection>('Connections', ConnectionSchema);

export {ConnectionModel, IConnection, StatusEnum};