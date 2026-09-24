import User from '../user/User.model';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from './Auth.utils';
import { TUser } from '../user/User.interface';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import generateOTP from '../../../util/generateOTP';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';

const OTP_EXPIRY_MINUTES = 10;

export const AuthServices = {
  async loginUser({ email, password }: { email: string; password: string }) {
    const user = await User.findOne({
      email,
    }).select('+password');

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    if (user.status !== 'ACTIVE') {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Account is not active. Please contact support.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect password!');
    }

    const {
      _id,
      gender,
      name: { firstName, lastName },
      role,
      avatar,
    } = user.toJSON();

    const partialUser: Partial<TUser> = {
      _id,
      email,
      gender,
      name: { firstName, lastName },
      role,
      avatar,
    };

    const jwtPayload = {
      email,
    };

    const accessToken = createToken(jwtPayload, 'access');

    const refreshToken = createToken(jwtPayload, 'refresh');

    return { accessToken, user: partialUser, refreshToken };
  },

  async changePassword(
    user: TUser,
    {
      newPassword,
      oldPassword,
    }: {
      newPassword: string;
      oldPassword: string;
    },
  ) {
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect password!');
    }

    newPassword = await bcrypt.hash(
      newPassword,
      +(config.bcrypt_salt_rounds as string),
    );

    await User.updateOne(
      {
        email: user.email,
      },
      {
        password: newPassword,
      },
    );
  },

  async forgetPassword({ email }: { email: string }) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    if (user.status !== 'ACTIVE') {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Account is not active. Please contact support.',
      );
    }

    const otp = generateOTP();

    await User.updateOne(
      { email },
      {
        otp,
        otpExpiry: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      },
    );

    await emailHelper.sendEmail(emailTemplate.resetPassword({ email, otp }));
  },

  async verifyOtp({ email, otp }: { email: string; otp: number }) {
    const user = await User.findOne({ email }).select('+otp +otpExpiry');

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    if (!user.otp || !user.otpExpiry) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'No OTP request found. Please request a new one.',
      );
    }

    if (user.otpExpiry.getTime() < Date.now()) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'OTP has expired. Please request a new one.',
      );
    }

    if (user.otp !== otp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid OTP!');
    }

    const resetToken = createToken({ email }, 'reset');

    return { resetToken };
  },

  async resetPassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }) {
    const { email } = verifyToken(token, 'reset');

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      +(config.bcrypt_salt_rounds as string),
    );

    await User.updateOne(
      { email },
      {
        password: hashedPassword,
        $unset: { otp: 1, otpExpiry: 1 },
      },
    );
  },

  async refreshToken(token: string) {
    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Access Denied!');
    }

    const { email } = verifyToken(token.split(' ')[0], 'refresh');

    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
    }

    if (user.status !== 'ACTIVE') {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Account is not active. Please contact support.',
      );
    }

    const jwtPayload = {
      email,
    };

    const accessToken = createToken(jwtPayload, 'access');

    return { accessToken };
  },
};
