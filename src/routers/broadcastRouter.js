'use strict';

import express from 'express';
import { BroadcastController } from '../controllers';
import { validationHandler } from '../middlewares';
import {
  broadCastIdParamValidation,
  broadcastQueryValidation
} from '../validations/broadcasts';

const { Router } = express;
const router = Router();

router.get(
  '/sheen-service/getActiveBroadcast',
  BroadcastController.getActiveBroadcast
);

router.get(
  '/sheen-service/getBroadcasts',
  broadcastQueryValidation,
  validationHandler,
  BroadcastController.getBroadcasts
);

router.delete(
  '/sheen-service/deleteBroadcast/:broadcastId',
  broadCastIdParamValidation,
  validationHandler,
  BroadcastController.deleteBroadcast
);

export default router;
