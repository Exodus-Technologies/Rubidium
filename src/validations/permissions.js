'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const permissionQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for permissions.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for permissions.')
];

const permissionPostValidation = [
  body('name').isString().withMessage('Must provide a permission name.'),
  body('value').isString().withMessage('Must provide a value for the role.'),
  body('description')
    .isString()
    .withMessage('Must provide a permission description.')
];

const permissionIdParamValidation = [
  param('permissionId')
    .isString()
    .withMessage('Must provide a existing permission id.')
];

const permissionUpdateValidation = [
  param('permissionId')
    .isString()
    .withMessage('Must provide a existing permission id.'),
  body('name')
    .isString()
    .optional()
    .withMessage('Must provide a permission name.'),
  body('value')
    .isString()
    .optional()
    .withMessage('Must provide a value for the role.'),
  body('description')
    .isString()
    .optional()
    .withMessage('Must provide a permission description.')
];

export {
  permissionIdParamValidation,
  permissionPostValidation,
  permissionQueryValidation,
  permissionUpdateValidation
};
