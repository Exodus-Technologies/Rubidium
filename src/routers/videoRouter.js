import express from 'express';
import { VideoController } from '../controllers';
import { rateLimiter, validateToken, validationHandler } from '../middlewares';
import {
  completeUploadBodyValidation,
  createVideoMetadataBodyValidation,
  initiateUploadBodyValidation,
  videoIdBodyUpdateValidation,
  videoIdParamValidation,
  videoQueryValidation
} from '../validations/videos';

const { Router } = express;
const router = Router();

router.use(rateLimiter);

router.post(
  '/initiateUpload',
  initiateUploadBodyValidation,
  validationHandler,
  VideoController.initiateUpload
);

router.post('/uploadVideo', VideoController.uploadVideo);

router.post(
  '/completeUpload',
  completeUploadBodyValidation,
  validationHandler,
  VideoController.completeUpload
);

router.post(
  '/createVideoMetadata',
  validateToken,
  createVideoMetadataBodyValidation,
  validationHandler,
  VideoController.createVideoMetadata
);

router.get('/getTotal', VideoController.getTotal);

router.get(
  '/getVideos',
  videoQueryValidation,
  validationHandler,
  VideoController.getVideos
);

router.get(
  '/getVideo/:videoId',
  videoIdParamValidation,
  validationHandler,
  VideoController.getVideo
);

router.put('/updateVideo', VideoController.updateVideo);

router.put(
  '/updateViews',
  videoIdBodyUpdateValidation,
  validationHandler,
  VideoController.updateViews
);

router.delete(
  '/deleteVideo/:videoId',
  videoIdParamValidation,
  validationHandler,
  VideoController.deleteVideoById
);

export default router;
