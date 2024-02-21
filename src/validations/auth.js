'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body } from 'express-validator';
import {
  PASSWORD_VALIDATION_MESSAGE,
  STRONG_PASSWORD_VALIDATIONS_REGEX
} from '../constants';

const loginValidation = [
  body('email')
    .isString()
    .isEmail()
    .withMessage('Must provide a existing and valid email.'),
  body('password').isString().withMessage(PASSWORD_VALIDATION_MESSAGE)
];

const changePasswordValidation = [
  body('email')
    .isString()
    .isEmail()
    .withMessage('Must provide a existing and valid email.'),
  body('token').isString().withMessage('Must provide a token.'),
  body('password')
    .isString()
    .matches(STRONG_PASSWORD_VALIDATIONS_REGEX)
    .withMessage(PASSWORD_VALIDATION_MESSAGE)
];

const passwordRequestResetBodyValidation = [
  body('email')
    .isString()
    .isEmail()
    .withMessage('Must provide a existing and valid email.')
];

const otpBodyValidation = [
  body('email')
    .isString()
    .isEmail()
    .withMessage('Must provide a existing and valid email.'),
  body('otpCode').isString().withMessage('Must provide a otpCode.')
];

export {
  changePasswordValidation,
  loginValidation,
  otpBodyValidation,
  passwordRequestResetBodyValidation
};
