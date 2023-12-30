'use strict';

import { StatusCodes } from 'http-status-codes';
import {
  getCategories,
  createCategory,
  deleteCategoryById,
  updateCategory,
  getCategoryById
} from '../queries/categories';
import { internalServerErrorRequest, badRequest } from '../response-codes';
import logger from '../logger';

exports.getCategories = async query => {
  try {
    const categories = await getCategories(query);
    if (categories) {
      return [
        StatusCodes.OK,
        { message: 'Categories fetched from db with success', categories }
      ];
    } else {
      return badRequest(
        `Unable to find categories that matched the search criteria.`
      );
    }
  } catch (err) {
    logger.error('Error getting categories: ', err);
    return internalServerErrorRequest('Error getting categories.');
  }
};

exports.getCategory = async categoryId => {
  try {
    const category = await getCategoryById(categoryId);
    if (category) {
      return [
        StatusCodes.OK,
        { message: 'Category fetched from db with success', category }
      ];
    } else {
      return badRequest(`No category found with id provided.`);
    }
  } catch (err) {
    logger.error('Error getting category by id ', err);
    return internalServerErrorRequest('Error getting category by id.');
  }
};

exports.createCategory = async payload => {
  try {
    const [error, category] = await createCategory(payload);
    if (category) {
      return [
        StatusCodes.CREATED,
        { message: 'Category created with success.', category }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error creating new category: ', err);
    return internalServerErrorRequest('Error creating new category.');
  }
};

exports.updateCategory = async (categoryId, name) => {
  try {
    const [error, category] = await updateCategory(categoryId, name);
    if (category) {
      return [
        StatusCodes.OK,
        { message: 'Category updated with success.', category }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error updating existing category: ', err);
    return internalServerErrorRequest('Error updating existing category.');
  }
};

exports.deleteCategoryById = async categoryId => {
  try {
    const [error, deletedCategory] = await deleteCategoryById(categoryId);
    if (deletedCategory) {
      return [StatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error deleting category by id: ', err);
    return internalServerErrorRequest('Error deleting category by id.');
  }
};
