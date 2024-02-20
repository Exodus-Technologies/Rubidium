'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const categoryQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for categories.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for categories.'),
  query('name')
    .isString()
    .withMessage('Must provide a existing category name.')
    .optional()
];

const categoryPostValidation = [
  body('name').isString().withMessage('Must provide a category name.'),
  body('description')
    .isString()
    .withMessage('Must provide a category description.')
];

const categoryIdParamValidation = [
  param('categoryId')
    .isString()
    .withMessage('Must provide a existing category id.')
];

const categoryUpdateValidation = [
  param('categoryId')
    .isString()
    .withMessage('Must provide a existing category id.'),
  body('name')
    .isString()
    .optional()
    .withMessage('Must provide a category name.'),
  body('description')
    .isString()
    .optional()
    .withMessage('Must provide a category description.')
];

export {
  categoryIdParamValidation,
  categoryPostValidation,
  categoryQueryValidation,
  categoryUpdateValidation
};
