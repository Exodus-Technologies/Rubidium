import express from 'express';
import { appIdQueryValidation } from '../validations/broadcasts';
import { validationHandler } from '../middlewares';
import { BambuserController } from '../controllers';

const { Router } = express;
const router = Router();

router.get(
  '/sheen-service/getApplicationId',
  appIdQueryValidation,
  validationHandler,
  BambuserController.getApplicationId
);

router.post(
  '/sheen-service/webHookCallback',
  BambuserController.webHookCallback
);

export default router;
