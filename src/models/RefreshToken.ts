import { model, Schema, Types } from 'mongoose';

export interface IRefreshToken {
  user: Types.ObjectId;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: { expires: '30d' },
  },
});

export default model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
