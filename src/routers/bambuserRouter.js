import express from 'express';
import { BambuserController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import { appIdQueryValidation } from '../validations/broadcasts';

const { Router } = express;
const router = Router();

router.use(rateLimiter);

router.get(
  '/getApplicationId',
  appIdQueryValidation,
  validationHandler,
  BambuserController.getApplicationId
);

router.post('/webHookCallback', BambuserController.webHookCallback);

export default router;
