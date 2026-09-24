import { z } from 'zod';

export const AuthValidation = {
  passwordChangeValidationSchema: z.object({
    body: z.object({
      oldPassword: z
        .string()
        .min(1, 'Old Password is required')
        .min(6, 'Old Password must be at least 6 characters long'),
      newPassword: z
        .string()
        .min(1, 'New Password is required')
        .min(6, 'New Password must be at least 6 characters long'),
    }),
  }),

  forgetPasswordValidationSchema: z.object({
    body: z.object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format'),
    }),
  }),

  verifyOtpValidationSchema: z.object({
    body: z.object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format'),
      otp: z
        .string({ required_error: 'OTP is required' })
        .length(6, 'OTP must be 6 digits'),
    }),
  }),

  resetPasswordValidationSchema: z.object({
    body: z.object({
      token: z
        .string({ required_error: 'Reset token is required' })
        .min(1, 'Reset token is required'),
      newPassword: z
        .string({ required_error: 'New Password is required' })
        .min(6, 'New Password must be at least 6 characters long'),
    }),
  }),

  refreshTokenValidationSchema: z.object({
    cookies: z.object({
      refreshToken: z.string({
        required_error: 'refreshToken is missing',
      }),
    }),
  }),
};
