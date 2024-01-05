'use strict';

import { AuthService } from '../services';
import logger from '../logger';

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [statusCode, response] = await AuthService.validateLogin(
      email,
      password
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with login: `, err);
    next(err);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const [statusCode, response] = await AuthService.requestPasswordReset(
      email,
      true
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error password reset requesting for user: ${email}: `, err);
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { email, otpCode } = req.body;
  try {
    const [statusCode, response] = await AuthService.verifyOTP(email, otpCode);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error verifying otp code for user: ${email}: `, err);
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;
    const [statusCode, response] = await AuthService.changePassword(
      email,
      token,
      password
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with changing password: `, err);
    next(err);
  }
};
