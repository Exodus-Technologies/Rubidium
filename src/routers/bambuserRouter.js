import express from 'express';
import { BambuserController } from '../controllers';
import { validationHandler } from '../middlewares';
import { appIdQueryValidation } from '../validations/broadcasts';

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
