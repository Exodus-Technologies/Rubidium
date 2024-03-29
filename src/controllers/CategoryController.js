'use strict';

import logger from '../logger';
import { CategoryService } from '../services';

exports.getCategories = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await CategoryService.getCategories(query);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with getting categories: `, err);
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const [statusCode, response] = await CategoryService.getCategory(
      categoryId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with getting category metadata by id: ${categoryId}: `,
      err
    );
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await CategoryService.createCategory(body);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with creating new category: `, err);
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { body } = req;
    const [statusCode, response] = await CategoryService.updateCategory(
      categoryId,
      body
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating category: `, err);
    next(err);
  }
};

exports.deleteCategoryById = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const [statusCode, response] = await CategoryService.deleteCategoryById(
      categoryId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with deleting category by id: ${categoryId}: `, err);
    next(err);
  }
};
