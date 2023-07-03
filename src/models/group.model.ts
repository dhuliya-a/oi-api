import {Schema, model, Document, Types} from 'mongoose';
import {ObjectId} from 'mongodb';

interface IGroup extends Document {
  creator: ObjectId;
  groupName: string;
  createdAt: Date;
  imageUrl: string;
  members: ObjectId[];
}

const GroupSchema = new Schema<IGroup>({
  creator: {type: ObjectId, required: true, ref: 'Users'},
  groupName: {type: String, required: true},
  createdAt: {type: Date, required: true},
  imageUrl: {type: String, default: null},
  //TODO - Look into the default value
  members: [{ type: ObjectId, ref: 'Users', required: true, default: [] }]
})

const GroupModel = model<IGroup>('Groups', GroupSchema);

export {GroupModel, IGroup};