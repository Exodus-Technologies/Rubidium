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

const createVideoMetadataBodyValidation = [
  body('title')
    .isString()
    .withMessage('Must provide a title for manual upload.'),
  body('description')
    .isString()
    .withMessage('Must provide a description for manual upload.'),
  body('categories')
    .isString()
    .withMessage('Must provide categories for manual upload.'),
  body('duration')
    .isString()
    .withMessage('Must provide video duration for manual upload.'),
  body('isAvailableForSale')
    .isBoolean()
    .optional()
    .withMessage('Must provide a boolean value if the asset is for sale.')
];

const initiateUploadBodyValidation = [
  body('fileName')
    .isString()
    .withMessage('Must provide a file name for initate multipart upload.'),
  body('fileType')
    .isString()
    .withMessage('Must provide a file type for initate multipart upload.')
];

const completeUploadBodyValidation = [
  body('fileName')
    .isString()
    .withMessage('Must provide a file name for completed multipart upload.'),
  body('uploadId')
    .isString()
    .withMessage('Must provide a upload Id for completed multipart upload.'),
  body('parts')
    .isArray()
    .notEmpty()
    .withMessage(
      'Must provide a parts array name for completed multipart upload.'
    )
];

export {
  completeUploadBodyValidation,
  createVideoMetadataBodyValidation,
  initiateUploadBodyValidation,
  videoIdBodyUpdateValidation,
  videoIdParamValidation,
  videoQueryValidation
};
