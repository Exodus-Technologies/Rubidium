'use strict';

import { badImplementationRequest, badRequest } from '../response-codes';
import {
  generateAuthJwtToken,
  generateTransactionId,
  generateOTPCode,
  verifyJwtToken
} from '../utilities/token';
import { EmailService } from '../services';
import {
  getCodeByUserId,
  getUserByEmail,
  createOtpCode,
  deleteCode,
  saveTransaction,
  verifyOptCode
} from '../queries/users';
import {
  PASSWORD_RESET_REQUEST_SUBJECT,
  PASSWORD_RESET_SUCCESS_SUBJECT
} from '../constants';

exports.validateLogin = async (email, password) => {
  try {
    const [error, user] = await getUserByEmail(email);
    if (user) {
      const validPassword = user.getIsValidPassword(password);
      if (validPassword) {
        const { email, fullName, city, state, isAdmin, userId } = user;
        const token = generateAuthJwtToken(user);
        return [
          200,
          {
            message: 'Successful login',
            user: {
              email,
              fullName,
              city,
              state,
              userId,
              isAdmin
            },
            token
          }
        ];
      }
      return badRequest(
        'Username and password combination was incorrect for user.'
      );
    }
    return badRequest(error.message);
  } catch (err) {
    console.log(`Error logging with credentials: `, err);
    return badImplementationRequest('Error logging with credentials.');
  }
};

exports.requestPasswordReset = async email => {
  try {
    const transactionId = generateTransactionId();
    const [error, user] = await getUserByEmail(email);
    if (!user) {
      const transaction = {
        transactionId,
        response: 'ERROR',
        email,
        reason: 'Email supplied is not registered to any user.'
      };
      saveTransaction(transaction);
      return badRequest(error.message);
    }

    const { userId } = user;

    const [_, existingCode] = await getCodeByUserId(userId);

    if (existingCode) {
      await deleteCode(userId);
    }

    const otpCode = generateOTPCode();

    await createOtpCode({
      userId,
      email,
      otpCode
    });

    const html = EmailService.generateHtmlRequestPayload(user, otpCode);

    EmailService.sendMail(email, PASSWORD_RESET_REQUEST_SUBJECT, html);

    const transaction = {
      transactionId,
      userId,
      email,
      response: 'SUCCESS',
      reason: 'Email was sent to user successfully for password request.',
      content: html
    };
    saveTransaction(transaction);
    return [
      200,
      {
        message: `Password reset success! An email with instructions has been sent to your email.`
      }
    ];
  } catch (err) {
    console.log(`Error password reset requesting: `, err);
    const transaction = {
      transactionId,
      response: 'ERROR',
      reason: `Email was not sent to user successfully due to: ${err.message}`
    };
    saveTransaction(transaction);
    return badImplementationRequest('Error password reset requesting.');
  }
};

exports.verifyOTP = async (email, otpCode) => {
  try {
    const [error, isVerified] = await verifyOptCode(email, otpCode);
    if (isVerified) {
      const [_, user] = await getUserByEmail(email);
      const token = generateAuthJwtToken(user);
      return [200, { message: 'Code was verified successfully.', token }];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error verifing code: ', err);
    return badImplementationRequest('Error verifing code.');
  }
};

exports.changePassword = async (email, token, password) => {
  try {
    const transactionId = generateTransactionId();
    const [error, user] = await getUserByEmail(email);

    if (!user) {
      const transaction = {
        transactionId,
        response: 'ERROR',
        email,
        reason: 'Email supplied is not registered to any user.'
      };
      saveTransaction(transaction);
      return badRequest(error.message);
    }

    const isVerified = verifyJwtToken(token);
    if (isVerified) {
      user.password = password;
      const updatedUser = await user.save();
      if (updatedUser) {
        const { userId } = updatedUser;
        const html = EmailService.generateHtmlResetPayload(user);
        EmailService.sendMail(email, PASSWORD_RESET_SUCCESS_SUBJECT, html);
        const transaction = {
          transactionId,
          userId,
          email,
          response: 'SUCCESS',
          reason: 'Email was sent to user successfully for password reset.',
          content: html
        };
        saveTransaction(transaction);
        await deleteCode(userId);
        return [
          200,
          {
            message: 'Password reset successful.'
          }
        ];
      }
    }
    return badRequest('Token provided does not match.');
  } catch (err) {
    console.log(`Error updating password: `, err);
    const transaction = {
      transactionId,
      response: 'ERROR',
      reason: `Email was not sent to user successfully due to: ${err.message}`
    };
    saveTransaction(transaction);
    return badImplementationRequest('Error updating password.');
  }
};
