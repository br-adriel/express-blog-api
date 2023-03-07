import { model, Schema } from 'mongoose';

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAuthor: boolean;
  isAdmin: boolean;
  fullName: string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 3,
  },
  firstName: { type: String, required: true, trim: true, minlength: 2 },
  lastName: { type: String, required: true, trim: true, minlength: 2 },
  isAdmin: { type: Boolean, required: true, default: false },
  isAuthor: { type: Boolean, required: true, default: true },
  password: { type: String, required: true },
});

UserSchema.virtual('fullName').get(function (this: IUser) {
  return this.firstName + ' ' + this.lastName;
});

export default model<IUser>('User', UserSchema);
