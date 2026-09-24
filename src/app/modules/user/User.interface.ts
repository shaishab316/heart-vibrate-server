import { Types } from 'mongoose';

export type TUserRole = 'USER' | 'ADMIN';

export type TUser = {
  _id?: Types.ObjectId;
  name: {
    firstName: string;
    lastName: string;
  };
  avatar: string;
  gender: 'male' | 'female';
  email: string;
  password: string;
  role: TUserRole;
  status?: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  otp?: number;
  otpExpiry?: Date;
};
