import config from '../../../config';
import { TUser } from '../user/User.interface';

export const adminData: Partial<TUser> = {
  name: {
    firstName: 'Shaishab',
    lastName: 'Chandra Shil',
  },
  gender: 'male',
  email: config.admin.email,
  password: config.admin.password,
  role: 'ADMIN',
  avatar: 'https://avatars.githubusercontent.com/u/109936547?v=4',
};
