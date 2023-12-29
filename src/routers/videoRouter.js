import express from 'express';
import { VideoController } from '../controllers';
import {
  videoIdParamValidation,
  videoQueryValidation,
  videoIdBodyUpdateValidation,
  manualUploadBodyValidation
} from '../validations/videos';
import { validationHandler } from '../middlewares';

const { Router } = express;
const router = Router();

router.post('/sheen-service/uploadVideo', VideoController.uploadVideo);

router.post(
  '/sheen-service/manualUpload',
  manualUploadBodyValidation,
  VideoController.manualUpload
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
