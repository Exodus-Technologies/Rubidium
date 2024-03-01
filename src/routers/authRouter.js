'use strict';

import express from 'express';
import { AuthController, UserController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import { isProductionEnvironment } from '../utilities/boolean';
import {
  changePasswordValidation,
  loginValidation,
  otpBodyValidation,
  passwordRequestResetBodyValidation
} from '../validations/auth';
import { userCreationValidation } from '../validations/users';

const { Router } = express;
const router = Router();

if (isProductionEnvironment()) {
  router.use(rateLimiter);
}

router.post('/login', loginValidation, validationHandler, AuthController.login);

router.post(
  '/signUp',
  userCreationValidation,
  validationHandler,
  UserController.createUser
);

router.post(
  '/requestPasswordReset',
  passwordRequestResetBodyValidation,
  validationHandler,
  AuthController.requestPasswordReset
);

router.post(
  '/verifyOTP',
  otpBodyValidation,
  validationHandler,
  AuthController.verifyOTP
);

router.put(
  '/changePassword',
  changePasswordValidation,
  validationHandler,
  AuthController.changePassword
);

export default router;
