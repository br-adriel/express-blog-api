import { model, Schema, Types } from 'mongoose';
import { IUser } from './User';

export interface IPost {
  title: string;
  content: string;
  author: IUser | Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true, minlength: 1 },
    title: { type: String, required: true, minlength: 1 },
  },
  {
    timestamps: true,
  }
);

export default model<IPost>('Post', PostSchema);
