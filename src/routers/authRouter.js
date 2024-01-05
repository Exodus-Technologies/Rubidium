'use strict';

import express from 'express';
import { AuthController, UserController } from '../controllers';
import { validationHandler } from '../middlewares';
import {
  changePasswordValidation,
  loginValidation,
  otpBodyValidation,
  passwordRequestResetBodyValidation
} from '../validations/auth';
import { userCreationValidation } from '../validations/users';

const { Router } = express;
const router = Router();

router.post(
  '/sheen-service/login',
  loginValidation,
  validationHandler,
  AuthController.login
);

router.post(
  '/sheen-service/signUp',
  userCreationValidation,
  validationHandler,
  UserController.createUser
);

router.post(
  '/sheen-service/requestPasswordReset',
  passwordRequestResetBodyValidation,
  validationHandler,
  AuthController.requestPasswordReset
);

router.post(
  '/sheen-service/verifyOTP',
  otpBodyValidation,
  validationHandler,
  AuthController.verifyOTP
);

router.put(
  '/sheen-service/changePassword',
  changePasswordValidation,
  validationHandler,
  AuthController.changePassword
);

export default router;
