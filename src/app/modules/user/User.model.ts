import { model, models, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser } from './User.interface';
import config from '../../../config';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'DELETED'],
      default: 'ACTIVE',
    },
    otp: {
      type: Number,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      +(config.bcrypt_salt_rounds as string),
    );
  }
  next();
});

userSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});

const User = models.User || model<TUser>('User', userSchema);

export default User;
