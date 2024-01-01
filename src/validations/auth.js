'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body } from 'express-validator';
import { STRONG_PASSWORD_VALIDATIONS } from '../constants';

const loginValidation = [
  body('email')
    .isString()
    .isEmail()
    .matches(/\S+@\S+\.\S+/)
    .withMessage('Must provide a existing and valid email.'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .isStrongPassword(STRONG_PASSWORD_VALIDATIONS)
    .withMessage(
      'Please enter a password at least 8 character and contain at least one uppercase, least one lower case, and at least one special character.'
    )
];

const changePasswordValidation = [
  body('email')
    .isString()
    .isEmail()
    .matches(/\S+@\S+\.\S+/)
    .withMessage('Must provide a existing and valid email.'),
  body('token').isString().withMessage('Must provide a token.'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .isStrongPassword(STRONG_PASSWORD_VALIDATIONS)
    .withMessage(
      'Please enter a password at least 8 character and contain at least one uppercase, least one lower case, and at least one special character.'
    )
];

const passwordRequestResetBodyValidation = [
  body('email')
    .isString()
    .isEmail()
    .matches(/\S+@\S+\.\S+/)
    .withMessage('Must provide a existing and valid email.')
];

const otpBodyValidation = [
  body('email')
    .isString()
    .isEmail()
    .matches(/\S+@\S+\.\S+/)
    .withMessage('Must provide a existing and valid email.'),
  body('otpCode').isString().withMessage('Must provide a otpCode.')
];

export {
  loginValidation,
  passwordRequestResetBodyValidation,
  changePasswordValidation,
  otpBodyValidation
};
