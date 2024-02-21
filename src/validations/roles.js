'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const roleQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for roles.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for roles.')
];

const rolePostValidation = [
  body('name').isString().withMessage('Must provide a role name.'),
  body('description')
    .isString()
    .withMessage('Must provide a role description.'),
  body('value').isString().withMessage('Must provide a value for the role.'),
  body('permissions')
    .isArray()
    .notEmpty()
    .withMessage('Must provide a list of permissions for role.')
];

const roleIdParamValidation = [
  param('roleId').isString().withMessage('Must provide a existing role id.')
];

const roleUpdateValidation = [
  param('roleId').isString().withMessage('Must provide a existing role id.'),
  body('name').isString().optional().withMessage('Must provide a role name.'),
  body('value')
    .isString()
    .optional()
    .withMessage('Must provide a value for the role.'),
  body('description')
    .isString()
    .optional()
    .withMessage('Must provide a role description.'),
  body('permissions')
    .isArray()
    .notEmpty()
    .optional()
    .withMessage('Must provide a list of permissions for role.')
];

export {
  roleIdParamValidation,
  rolePostValidation,
  roleQueryValidation,
  roleUpdateValidation
};
