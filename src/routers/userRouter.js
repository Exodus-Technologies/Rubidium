'use strict';

import express from 'express';
import { UserController } from '../controllers';
import {
  userCreationValidation,
  userIdParamValidation,
  userQueryValidation,
  userUpdateValidation
} from '../validations/users';
import { validationHandler } from '../middlewares';

const { Router } = express;
const router = Router();

router.get(
  '/sheen-service/getUsers',
  userQueryValidation,
  validationHandler,
  UserController.getUsers
);

router.get(
  '/sheen-service/getUser/:userId',
  userIdParamValidation,
  validationHandler,
  UserController.getUser
);

router.post(
  '/sheen-service/createUser',
  userCreationValidation,
  validationHandler,
  UserController.createUser
);

router.put(
  '/sheen-service/updateUser/:userId',
  userUpdateValidation,
  validationHandler,
  UserController.updateUser
);

router.delete(
  '/sheen-service/deleteUser/:userId',
  userIdParamValidation,
  validationHandler,
  UserController.deleteUser
);

export default router;
