import { model, Schema, Types } from 'mongoose';
import { IPost } from './Post';
import { IUser } from './User';

interface IComment {
  content: string;
  author: IUser | Types.ObjectId;
  post: IPost | Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true, minlength: 1, maxlength: 280 },
    post: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
  },
  {
    timestamps: true,
  }
);

export default model<IComment>('Comment', CommentSchema);
