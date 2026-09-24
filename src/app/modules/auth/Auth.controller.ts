import { AuthServices } from './Auth.service';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import config from '../../../config';
import sendResponse from '../../../shared/sendResponse';

export const AuthController = {
  login: catchAsync(async (req, res) => {
    const { body } = req;
    const { accessToken, refreshToken, user } =
      await AuthServices.loginUser(body);

    res.cookie('refreshToken', refreshToken, {
      secure: config.node_env !== 'development',
      httpOnly: true,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Login successfully!',
      data: { token: accessToken, user },
    });
  }),

  logout: catchAsync(async (_req, res) => {
    res.cookie('refreshToken', '', {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      expires: new Date(0), // remove refreshToken
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Logged out successfully',
    });
  }),

  changePassword: catchAsync(async (req, res) => {
    await AuthServices.changePassword(req.user, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Password has changed successfully!',
      data: null,
    });
  }),

  forgetPassword: catchAsync(async (req, res) => {
    const { email } = req.body;

    await AuthServices.forgetPassword({ email });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'OTP sent to your email successfully!',
      data: null,
    });
  }),

  verifyOtp: catchAsync(async (req, res) => {
    const { email, otp } = req.body;

    const result = await AuthServices.verifyOtp({ email, otp: Number(otp) });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'OTP verified successfully!',
      data: result,
    });
  }),

  resetPassword: catchAsync(async (req, res) => {
    const { token, newPassword } = req.body;

    await AuthServices.resetPassword({ token, newPassword });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Password has been reset successfully!',
      data: null,
    });
  }),

  refreshToken: catchAsync(async (req, res) => {
    const result = await AuthServices.refreshToken(req.cookies.refreshToken);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'New Access create successfully!',
      data: result,
    });
  }),
};
