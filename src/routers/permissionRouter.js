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
  '/getPermissions',
  permissionQueryValidation,
  validationHandler,
  PermissionController.getPermissions
);

router.get(
  '/getPermission/:permissionId',
  permissionIdParamValidation,
  validationHandler,
  PermissionController.getPermission
);

router.post(
  '/createPermission',
  permissionPostValidation,
  validationHandler,
  PermissionController.createPermission
);

router.put(
  '/updatePermission/:permissionId',
  permissionUpdateValidation,
  validationHandler,
  PermissionController.updatePermission
);

router.delete(
  '/deletePermission/:permissionId',
  permissionIdParamValidation,
  validationHandler,
  PermissionController.deletePermissionById
);

export default router;
