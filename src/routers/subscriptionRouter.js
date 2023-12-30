import express from 'express';
import { SubscriptionController } from '../controllers';
import {
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionStatusQueryValidation,
  subscriptionIdParamValidation,
  subscriptionUpdateBodyValidation,
  userIdParamValidation
} from '../validations/subscriptions';
import { validationHandler } from '../middlewares';

const { Router } = express;

const router = Router();

router.get(
  '/sheen-service/getSubscriptions',
  subscriptionQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptions
);

router.get(
  '/sheen-service/getUserSubscriptions/:userId',
  userIdParamValidation,
  validationHandler,
  SubscriptionController.getUserSubscriptions
);

router.get(
  '/sheen-service/getSubscription/:subscriptionId',
  subscriptionIdParamValidation,
  validationHandler,
  SubscriptionController.getSubscription
);

router.get(
  '/sheen-service/getSubscriptionStatus',
  subscriptionStatusQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptionStatus
);

router.post(
  '/sheen-service/createSubscription',
  subscriptionPostBodyValidation,
  validationHandler,
  SubscriptionController.createSubscription
);

router.put(
  '/sheen-service/updateSubscription/:subscriptionId',
  subscriptionUpdateBodyValidation,
  validationHandler,
  SubscriptionController.updateSubscription
);

router.delete(
  '/sheen-service/deleteSubscription/:subscriptionId',
  subscriptionIdParamValidation,
  validationHandler,
  SubscriptionController.deleteSubscription
);

router.delete(
  '/sheen-service/deleteSubscriptions/:userId',
  userIdParamValidation,
  validationHandler,
  SubscriptionController.deleteSubscriptions
);

export default router;
