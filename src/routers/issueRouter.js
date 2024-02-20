'use strict';

import express from 'express';
import { IssueController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import {
  issueIdBodyValidation,
  issueIdParamValidation,
  issueQueryValidation
} from '../validations/issues';

const { Router } = express;

const router = Router();

router.use(rateLimiter);

router.get(
  '/getIssues',
  issueQueryValidation,
  validationHandler,
  IssueController.getIssues
);

router.get('/getTotal', IssueController.getTotal);

router.get('/getNextIssueOrder', IssueController.getNextIssueOrder);

router.get(
  '/getIssue/:issueId',
  issueIdParamValidation,
  validationHandler,
  IssueController.getIssueById
);

router.post('/createIssue', IssueController.createIssue);

router.put('/updateIssue', IssueController.updateIssue);

router.put(
  '/updateViews',
  issueIdBodyValidation,
  validationHandler,
  IssueController.updateViews
);

router.delete(
  '/deleteIssue/:issueId',
  issueIdParamValidation,
  validationHandler,
  IssueController.deleteIssueById
);

export default router;
