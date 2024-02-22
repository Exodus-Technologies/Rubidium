'use strict';

import express from 'express';
import { PermissionController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import {
  permissionIdParamValidation,
  permissionPostValidation,
  permissionQueryValidation,
  permissionUpdateValidation
} from '../validations/permissions';

const { Router } = express;
const router = Router();

router.use(rateLimiter);

router.get(
  '/sheen-service/getPermissions',
  permissionQueryValidation,
  validationHandler,
  PermissionController.getPermissions
);

router.get(
  '/sheen-service/getPermission/:permissionId',
  permissionIdParamValidation,
  validationHandler,
  PermissionController.getPermission
);

router.post(
  '/sheen-service/createPermission',
  permissionPostValidation,
  validationHandler,
  PermissionController.createPermission
);

router.put(
  '/sheen-service/updatePermission/:permissionId',
  permissionUpdateValidation,
  validationHandler,
  PermissionController.updatePermission
);

router.delete(
  '/sheen-service/deletePermission/:permissionId',
  permissionIdParamValidation,
  validationHandler,
  PermissionController.deletePermissionById
);

export default router;
