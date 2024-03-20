'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, param, query } from 'express-validator';
import { VIDEO_STATUSES } from '../constants';

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
    .optional(),
  body('status')
    .isString()
    .custom(status => {
      if (!VIDEO_STATUSES.includes(status)) {
        throw new Error('Status submitted is not allowed for this field.');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })
    .optional()
];

const videoIdBodyUpdateValidation = [
  body('videoId').isNumeric().withMessage('Must provide a existing video id.')
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

const updateVideoBodyValidation = [
  ...videoIdParamValidation,
  body('title')
    .isString()
    .withMessage('Must provide a title for manual upload.')
    .optional(),
  body('description')
    .isString()
    .withMessage('Must provide a description for manual upload.')
    .optional(),
  body('categories')
    .isString()
    .withMessage('Must provide categories for manual upload.')
    .optional(),
  body('url')
    .isString()
    .withMessage('Must provide the video url for upload.')
    .optional(),
  body('duration')
    .isString()
    .withMessage('Must provide the duration of the video upload.')
    .optional(),
  body('videoKey')
    .isString()
    .withMessage('Must provide the video key for s3 location.')
    .optional(),
  body('thumbnail')
    .isString()
    .withMessage('Must provide thumbnail for manual upload.')
    .optional(),
  body('thumbnailKey')
    .isString()
    .withMessage('Must provide the thumbnail key for s3 location.')
    .optional(),
  body('isAvailableForSale')
    .isString()
    .withMessage('Must provide a value if the asset is for sale.')
    .optional()
];

export {
  updateVideoBodyValidation,
  uploadVideoBodyValidation,
  videoIdBodyUpdateValidation,
  videoIdParamValidation,
  videoQueryValidation
};
