'use strict';

import express from 'express';
import { RoleController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import { isProductionEnvironment } from '../utilities/boolean';
import {
  roleIdParamValidation,
  rolePostValidation,
  roleQueryValidation,
  roleUpdateValidation
} from '../validations/roles';

const { Router } = express;
const router = Router();

if (isProductionEnvironment()) {
  router.use(rateLimiter);
}

router.get(
  '/getRoles',
  roleQueryValidation,
  validationHandler,
  RoleController.getRoles
);

router.get(
  '/getRole/:roleId',
  roleIdParamValidation,
  validationHandler,
  RoleController.getRole
);

router.post(
  '/createRole',
  rolePostValidation,
  validationHandler,
  RoleController.createRole
);

router.put(
  '/updateRole/:roleId',
  roleUpdateValidation,
  validationHandler,
  RoleController.updateRole
);

router.delete(
  '/deleteRole/:roleId',
  roleIdParamValidation,
  validationHandler,
  RoleController.deleteRole
);

export default router;
