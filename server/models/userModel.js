import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema (
  {
    _id: Schema.Types.ObjectId,
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
    },
  },
  { timestamps: true },
);

const User = model('User', userSchema);
export default User;