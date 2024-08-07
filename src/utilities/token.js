'use strict';

import jwt from 'jsonwebtoken';
import moment from 'moment';
import { customAlphabet } from 'nanoid';
import config from '../config';
import { CUSTOM_ALPHABET, TOKEN_EXPIRY } from '../constants';

const { sign, verify } = jwt;
const { JWT_SECRET } = config;

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
    return sign(
      {
        exp: Math.ceil(expirationTime),
        data: payload
      },
      JWT_SECRET
    );
  } catch {
    console.error(err);
    return undefined;
  }
};

export const verifyJWTToken = token => {
  try {
    const decoded = verify(token, JWT_SECRET);
    if (decoded) {
      return decoded;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};
