import express from 'express';
import { AuthController } from './Auth.controller';
import { AuthValidation } from './Auth.validation';
import auth from '../../middlewares/auth';
import { UserControllers } from '../user/User.controller';
import { UserValidation } from '../user/User.validation';
import imageUploader from '../../middlewares/imageUploader';
import purifyRequest from '../../middlewares/purifyRequest';

const router = express.Router();

router.post(
  '/register',
  imageUploader((req, images) => {
    req.body.avatar = images[0];
  }),
  purifyRequest(UserValidation.userValidationSchema),
  UserControllers.createUser,
);

router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);

router.patch(
  '/change-password',
  auth('USER', 'ADMIN'),
  purifyRequest(AuthValidation.passwordChangeValidationSchema),
  AuthController.changePassword,
);

/**
 * send a one time password to the user's email
 */
router.post(
  '/forget-password',
  purifyRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);

/**
 * verify the otp and get a reset token back
 */
router.post(
  '/verify-otp',
  purifyRequest(AuthValidation.verifyOtpValidationSchema),
  AuthController.verifyOtp,
);

/**
 * reset the password using the reset token from verify-otp
 */
router.post(
  '/reset-password',
  purifyRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword,
);

/**
 * generate new access token
 */
router.get(
  '/refresh-token',
  purifyRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

export const AuthRoutes = router;
