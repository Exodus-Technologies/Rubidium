'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { query, body, param } from 'express-validator';

import { STATES, PASSWORD_REGEX } from '../constants';

const userQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for users'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for users'),
  query('city').isString().optional(),
  query('state').isString().optional().isLength({ min: 2 })
];

const userCreationValidation = [
  body('email')
    .isString()
    .isEmail()
    .matches(/\S+@\S+\.\S+/)
    .withMessage('Must provide a existing and valid email.'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Please enter a password at least 8 character and contain at least one uppercase, least one lower case, and at least one special character.'
    ),
  body('fullName')
    .isString()
    .withMessage('Must provide your first and last name.'),
  body('dob').isString().optional(),
  body('city')
    .isString()
    .withMessage('Must provide the city in which you stay.')
    .optional(),
  body('state')
    .isString()
    .custom(state => {
      if (!STATES.includes(state)) {
        throw new Error('State submitted is not allowed for this field.');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })
    .isLength({ min: 2 })
    .optional(),
  body('zipCode').isString().isLength({ min: 5 }).optional()
];

const userUpdateValidation = [
  param('userId').isString().withMessage('Must provide a valid userId.'),
  body('email')
    .isString()
    .isEmail()
    .matches(/\S+@\S+\.\S+/)
    .withMessage('Must provide a existing and valid email.')
    .optional(),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Please enter a password at least 8 character and contain at least one uppercase, least one lower case, and at least one special character.'
    )
    .optional(),
  body('fullName')
    .isString()
    .withMessage('Must provide your first and last name.')
    .optional(),
  body('city')
    .isString()
    .withMessage('Must provide the city in which you stay.')
    .optional(),
  body('state')
    .isString()
    .custom(state => {
      if (!STATES.includes(state)) {
        throw new Error('State submitted is not allowed for this field.');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })
    .isLength({ min: 2 })
    .optional(),
  body('zipCode').isString().isLength({ min: 5 }).optional()
];

const userIdParamValidation = [
  param('userId').isString().withMessage('Must provide a existing user id.')
];

const loginValidation = [
  body('email')
    .isString()
    .isEmail()
    .matches(/\S+@\S+\.\S+/)
    .withMessage('Must provide a existing and valid email.'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .matches(PASSWORD_REGEX)
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
    .matches(PASSWORD_REGEX)
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

const platfromQueryValidation = [
  query('platform').isString().withMessage('Must provide a device platform.')
];

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

export {
  userCreationValidation,
  userUpdateValidation,
  userQueryValidation,
  loginValidation,
  userIdParamValidation,
  passwordRequestResetBodyValidation,
  changePasswordValidation,
  platfromQueryValidation,
  otpBodyValidation
};
