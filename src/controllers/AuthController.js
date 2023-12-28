'use strict';

import { AuthService } from '../services';

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [statusCode, response] = await AuthService.validateLogin(
      email,
      password
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with login: `, err);
    next(err);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [statusCode, response] = await AuthService.requestPasswordReset(
      email,
      true
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error password reset requesting for user: ${email}: `, err);
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;
    const [statusCode, response] = await AuthService.verifyOTP(email, otpCode);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error verifying otp code for user: ${email}: `, err);
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
    console.log(`Error with changing password: `, err);
    next(err);
  }
};
