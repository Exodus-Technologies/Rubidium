import express from 'express';
import { VideoController } from '../controllers';
import { validateToken, validationHandler } from '../middlewares';
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

router.post(
  '/sheen-service/initiateUpload',
  initiateUploadBodyValidation,
  validationHandler,
  VideoController.initiateUpload
);

router.post('/sheen-service/uploadVideo', VideoController.uploadVideo);

router.post(
  '/sheen-service/completeUpload',
  completeUploadBodyValidation,
  validationHandler,
  VideoController.completeUpload
);

router.post(
  '/sheen-service/createVideoMetadata',
  validateToken,
  createVideoMetadataBodyValidation,
  validationHandler,
  VideoController.createVideoMetadata
);

router.get('/sheen-service/getTotal', VideoController.getTotal);

router.get(
  '/sheen-service/getVideos',
  videoQueryValidation,
  validationHandler,
  VideoController.getVideos
);

router.get(
  '/sheen-service/getVideo/:videoId',
  videoIdParamValidation,
  validationHandler,
  VideoController.getVideo
);

router.put('/sheen-service/updateVideo', VideoController.updateVideo);

router.put(
  '/sheen-service/updateViews',
  videoIdBodyUpdateValidation,
  validationHandler,
  VideoController.updateViews
);

router.delete(
  '/sheen-service/deleteVideo/:videoId',
  videoIdParamValidation,
  validationHandler,
  VideoController.deleteVideoById
);

export default router;
