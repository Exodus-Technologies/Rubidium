'use strict';

import express from 'express';
import { CategoryController } from '../controllers';
import { rateLimiter, validationHandler } from '../middlewares';
import {
  categoryIdParamValidation,
  categoryPostValidation,
  categoryQueryValidation,
  categoryUpdateValidation
} from '../validations/categories';

const { Router } = express;
const router = Router();

router.use(rateLimiter);

router.get(
  '/getCategories',
  categoryQueryValidation,
  validationHandler,
  CategoryController.getCategories
);

router.get(
  '/getCategory/:categoryId',
  categoryIdParamValidation,
  validationHandler,
  CategoryController.getCategory
);

router.post(
  '/createCategory',
  categoryPostValidation,
  validationHandler,
  CategoryController.createCategory
);

router.put(
  '/updateCategory/:categoryId',
  categoryUpdateValidation,
  validationHandler,
  CategoryController.updateCategory
);

router.delete(
  '/deleteCategory/:categoryId',
  categoryIdParamValidation,
  validationHandler,
  CategoryController.deleteCategoryById
);

export default router;
