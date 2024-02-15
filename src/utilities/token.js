'use strict';

import jwt from 'jsonwebtoken';
import moment from 'moment';
import { customAlphabet } from 'nanoid';
import config from '../config';
import { CUSTOM_ALPHABET, TOKEN_EXPIRY } from '../constants';

const { sign, verify } = jwt;
const { jwtSecret } = config;

export const generateTransactionId = () => {
  return customAlphabet(CUSTOM_ALPHABET, 12)();
};

export const generateOTPCode = () => {
  return customAlphabet(CUSTOM_ALPHABET, 6)();
};

export const generateAuthJWTToken = user => {
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

export const verifyJWTToken = token => {
  try {
    const decoded = verify(token, jwtSecret);
    if (decoded) {
      return decoded;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
