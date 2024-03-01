'use strict';

import express from 'express';
import { BroadcastController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import { isProductionEnvironment } from '../utilities/boolean';
import {
  broadCastIdParamValidation,
  broadcastQueryValidation
} from '../validations/broadcasts';

const { Router } = express;
const router = Router();

if (isProductionEnvironment()) {
  router.use(rateLimiter);
}

router.get('/getActiveBroadcast', BroadcastController.getActiveBroadcast);

router.get(
  '/getBroadcasts',
  broadcastQueryValidation,
  validationHandler,
  BroadcastController.getBroadcasts
);

router.delete(
  '/deleteBroadcast/:broadcastId',
  broadCastIdParamValidation,
  validationHandler,
  BroadcastController.deleteBroadcast
);

export default router;
