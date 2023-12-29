'use strict';

import express from 'express';
import { CategoryController } from '../controllers';
import {
  categoryQueryValidation,
  categoryPostValidation,
  categoryIdParamValidation,
  categoryUpdateValidation
} from '../validations/categories';
import { validationHandler } from '../middlewares';

const { Router } = express;
const router = Router();

router.get(
  '/sheen-service/getCategories',
  categoryQueryValidation,
  validationHandler,
  CategoryController.getCategories
);

router.get(
  '/sheen-service/getCategory/:categoryId',
  categoryIdParamValidation,
  validationHandler,
  CategoryController.getCategory
);

router.post(
  '/sheen-service/createCategory',
  categoryPostValidation,
  validationHandler,
  CategoryController.createCategory
);

router.put(
  '/sheen-service/updateCategory/:categoryId',
  categoryUpdateValidation,
  validationHandler,
  CategoryController.updateCategory
);

router.delete(
  '/sheen-service/deleteCategory/:categoryId',
  categoryIdParamValidation,
  validationHandler,
  CategoryController.deleteCategoryById
);

export default router;
