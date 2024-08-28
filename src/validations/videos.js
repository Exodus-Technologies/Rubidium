'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';

const videoQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for videos.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for videos.'),
  query('title')
    .isString()
    .withMessage('Must provide a existing video title.')
    .optional(),
  query('categories')
    .isString()
    .withMessage('Must provide a category for video to match with.')
    .optional(),
  query('userId')
    .isString()
    .withMessage('Must provide a valid userId.')
    .optional()
];

const videoIdBodyUpdateValidation = [
  body('videoId').isString().withMessage('Must provide a existing video id.')
];

const videoIdParamValidation = [
  param('videoId').isString().withMessage('Must provide a existing video id.')
];

const uploadVideoBodyValidation = [
  body('title')
    .isString()
    .withMessage('Must provide a title for manual upload.'),
  body('description')
    .isString()
    .withMessage('Must provide a description for manual upload.'),
  body('categories')
    .isString()
    .withMessage('Must provide categories for manual upload.'),
  body('url').isString().withMessage('Must provide the video url for upload.'),
  body('duration')
    .isString()
    .withMessage('Must provide the duration of the video upload.'),
  body('videoKey')
    .isString()
    .withMessage('Must provide the video key for s3 location.'),
  body('thumbnail')
    .isString()
    .withMessage('Must provide thumbnail for manual upload.'),
  body('thumbnailKey')
    .isString()
    .withMessage('Must provide the thumbnail key for s3 location.'),
  body('isAvailableForSale')
    .isString()
    .withMessage('Must provide a value if the asset is for sale.')
];

export {
  uploadVideoBodyValidation,
  videoIdBodyUpdateValidation,
  videoIdParamValidation,
  videoQueryValidation
};
