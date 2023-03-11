import { model, Schema, Types } from 'mongoose';
import Comment from './Comment';
import { IUser } from './User';

export interface IPost {
  title: string;
  content: string;
  author: (IUser & { _id?: string }) | Types.ObjectId;
  isPublished: boolean;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    content: { type: String, required: true, minlength: 1 },
    title: { type: String, required: true, minlength: 1 },
    isPublished: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

PostSchema.virtual('commentsCount', {
  count: true,
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

export default model<IPost>('Post', PostSchema);
