import express from 'express';
import { VideoController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import { isProductionEnvironment } from '../utilities/boolean';
import {
  updateVideoBodyValidation,
  uploadVideoBodyValidation,
  videoIdBodyUpdateValidation,
  videoIdParamValidation,
  videoQueryValidation
} from '../validations/videos';

const { Router } = express;
const router = Router();

if (isProductionEnvironment()) {
  router.use(rateLimiter);
}

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

router.post(
  '/uploadVideo',
  uploadVideoBodyValidation,
  validationHandler,
  VideoController.uploadVideo
);

router.post(
  '/createVideoMeta',
  uploadVideoBodyValidation,
  validationHandler,
  VideoController.createVideoMeta
);

router.put(
  '/updateVideo/:videoId',
  updateVideoBodyValidation,
  validationHandler,
  VideoController.updateVideo
);

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
  VideoController.deleteVideo
);

export default router;
