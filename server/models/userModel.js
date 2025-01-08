import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const userSchema = new Schema(
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
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  console.log(`#️⃣ Hashing Password...`);
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next({
      log: `🥲 Error while hashing password: ${error}`,
      status: 500,
      message: 'Unable to sign up at this time',
    });
  }
});

const User = model('User', userSchema);
export default User;
