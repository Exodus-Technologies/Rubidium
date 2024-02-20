import express from 'express';
import { SubscriptionController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import {
  subscriptionIdParamValidation,
  subscriptionPostBodyValidation,
  subscriptionQueryValidation,
  subscriptionStatusQueryValidation,
  subscriptionUpdateBodyValidation,
  userIdParamValidation
} from '../validations/subscriptions';

const { Router } = express;

const router = Router();

router.use(rateLimiter);

router.get(
  '/getSubscriptions',
  subscriptionQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptions
);

router.get(
  '/getUserSubscriptions/:userId',
  userIdParamValidation,
  validationHandler,
  SubscriptionController.getUserSubscriptions
);

router.get(
  '/getSubscription/:subscriptionId',
  subscriptionIdParamValidation,
  validationHandler,
  SubscriptionController.getSubscription
);

router.get(
  '/getSubscriptionStatus',
  subscriptionStatusQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptionStatus
);

router.post(
  '/createSubscription',
  subscriptionPostBodyValidation,
  validationHandler,
  SubscriptionController.createSubscription
);

router.put(
  '/updateSubscription/:subscriptionId',
  subscriptionUpdateBodyValidation,
  validationHandler,
  SubscriptionController.updateSubscription
);

router.delete(
  '/deleteSubscription/:subscriptionId',
  subscriptionIdParamValidation,
  validationHandler,
  SubscriptionController.deleteSubscription
);

router.delete(
  '/deleteSubscriptions/:userId',
  userIdParamValidation,
  validationHandler,
  SubscriptionController.deleteSubscriptions
);

export default router;
