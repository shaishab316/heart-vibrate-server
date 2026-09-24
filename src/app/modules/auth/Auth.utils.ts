import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

export type TTokenType = 'access' | 'reset' | 'refresh';

export const createToken = (jwtPayload: JwtPayload, type: TTokenType) => {
  jwtPayload.tokenType = type;

  let token = '';

  switch (type) {
    case 'access':
      token = jwt.sign(jwtPayload, config.jwt.jwt_secret as string, {
        expiresIn: config.jwt.jwt_expire_in,
      });
      break;
    case 'reset':
      token = jwt.sign(jwtPayload, config.jwt.jwt_secret as string, {
        expiresIn: '10m',
      });
      break;
    case 'refresh':
      token = jwt.sign(jwtPayload, config.jwt.jwtRefreshSecret as string, {
        expiresIn: config.jwt.jwtRefreshExpiresIn,
      });
  }

  return token;
};

export const verifyToken = (token: string, type: TTokenType) => {
  let user: JwtPayload;

  switch (type) {
    case 'access':
      user = jwt.verify(token, config.jwt.jwt_secret as string) as JwtPayload;
      break;
    case 'reset':
      user = jwt.verify(token, config.jwt.jwt_secret as string) as JwtPayload;
      break;
    case 'refresh':
      user = jwt.verify(
        token,
        config.jwt.jwtRefreshSecret as string,
      ) as JwtPayload;
  }

  // make sure a token is only accepted for the purpose it was issued for
  if (user.tokenType !== type) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token!');
  }

  return user;
};
