'use strict';

import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config';
import { TOKEN_EXPIRY } from '../constants';

const { customAlphabet } = nanoid;
const { sign, verify } = jwt;
const { jwtSecret } = config;

export const generateTransactionId = () => {
  const nanoid = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    12
  );
  return nanoid();
};

export const generateOTPCode = () => {
  const nanoid = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    6
  );
  return nanoid();
};

export const generateAuthJwtToken = user => {
  const { isAdmin, email, userId } = user;
  const expirationTime = moment().add(TOKEN_EXPIRY, 'minutes').valueOf() / 1000;
  const payload = { isAdmin, email, userId };
  try {
    const token = sign(
      {
        exp: Math.ceil(expirationTime),
        data: payload
      },
      jwtSecret
    );
    return token;
  } catch {
    return undefined;
  }
};

export const verifyJwtToken = token => {
  try {
    const decoded = verify(token, jwtSecret);
    if (decoded) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};
