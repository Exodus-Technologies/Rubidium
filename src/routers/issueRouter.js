'use strict';

import express from 'express';

const { Router } = express;
import { IssueController } from '../controllers';
import {
  issueQueryValidation,
  issueIdParamValidation,
  issueIdBodyValidation
} from '../validations/issues';
import { validationHandler } from '../middlewares';

const router = Router();

router.get(
  '/sheen-service/getIssues',
  issueQueryValidation,
  validationHandler,
  IssueController.getIssues
);

router.get('/sheen-service/getTotal', IssueController.getTotal);

router.get(
  '/sheen-service/getNextIssueOrder',
  IssueController.getNextIssueOrder
);

router.get(
  '/sheen-service/getIssue/:issueId',
  issueIdParamValidation,
  validationHandler,
  IssueController.getIssueById
);

router.post('/sheen-service/createIssue', IssueController.createIssue);

router.put('/sheen-service/updateIssue', IssueController.updateIssue);

router.put(
  '/sheen-service/updateViews',
  issueIdBodyValidation,
  validationHandler,
  IssueController.updateViews
);

router.delete(
  '/sheen-service/deleteIssue/:issueId',
  issueIdParamValidation,
  validationHandler,
  IssueController.deleteIssueById
);

export default router;
