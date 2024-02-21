'use strict';

import express from 'express';
import { RoleController } from '../controllers';
import { validationHandler } from '../middlewares';
import {
  roleIdParamValidation,
  rolePostValidation,
  roleQueryValidation,
  roleUpdateValidation
} from '../validations/roles';

const { Router } = express;
const router = Router();

router.get(
  '/sheen-service/getRoles',
  roleQueryValidation,
  validationHandler,
  RoleController.getRoles
);

router.get(
  '/sheen-service/getRole/:roleId',
  roleIdParamValidation,
  validationHandler,
  RoleController.getRole
);

router.post(
  '/sheen-service/createRole',
  rolePostValidation,
  validationHandler,
  RoleController.createRole
);

router.put(
  '/sheen-service/updateRole/:roleId',
  roleUpdateValidation,
  validationHandler,
  RoleController.updateRole
);

router.delete(
  '/sheen-service/deleteRole/:roleId',
  roleIdParamValidation,
  validationHandler,
  RoleController.deleteRole
);

export default router;
