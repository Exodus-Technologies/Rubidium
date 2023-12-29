'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const appIdQueryValidation = [
  query('platform').isString().withMessage('Must provide a device platform.')
];

const broadCastIdBodyValidation = [
  body('broadcastId').isString().withMessage('Must provide a broadcast id.')
];

const broadCastIdParamValidation = [
  param('broadcastId').isNumeric().withMessage('Must provide a broadcast id.')
];

const broadcastQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for broadcasts.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for broadcasts.')
];

export {
  appIdQueryValidation,
  broadCastIdBodyValidation,
  broadCastIdParamValidation,
  broadcastQueryValidation
};
