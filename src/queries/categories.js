'use strict';

import models from '../models';
import logger from '../logger';

export const getCategories = async query => {
  try {
    const { Category } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;
    const filter = [];
    for (const [key, value] of Object.entries(query)) {
      if (key != 'page' && key != 'limit' && key != 'sort') {
        filter.push({ [key]: { $regex: value, $options: 'i' } });
      }
    }
    let objectFilter = {};
    if (filter.length > 0) {
      objectFilter = {
        $and: filter
      };
    }

    let sortString = '-id';
    if (query.sort) {
      sortString = query.sort;
    }

    return await Category.find(objectFilter)
      .limit(limit)
      .skip(skipIndex)
      .sort(sortString)
      .lean()
      .exec();
  } catch (err) {
    logger.error('Error getting category data from db: ', err);
  }
};

export const getCategoryById = async categoryId => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ categoryId });
    return category;
  } catch (err) {
    logger.error('Error getting catgeory data from db by id: ', err);
  }
};

export const getCategoryByName = async name => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name });
    return category;
  } catch (err) {
    logger.error('Error getting category data from db by name: ', err);
  }
};

export const createCategory = async payload => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name: payload.name });
    if (category) {
      return [Error('category with name already exists.'), null];
    }
    const cat = new Category(payload);
    const createdCategory = await cat.save();
    const { description, name, categoryId } = createdCategory;
    return [null, { description, name, categoryId }];
  } catch (err) {
    logger.error('Error saving category data to db: ', err);
  }
};

export const updateCategory = async (categoryId, name) => {
  try {
    const { Category } = models;
    const filter = { categoryId };
    const options = { new: true };
    const update = { name };
    const category = await Category.findOneAndUpdate(filter, update, options);
    return [null, category];
  } catch (err) {
    logger.error('Error updating category data to db: ', err);
  }
};

export const deleteCategoryById = async categoryId => {
  try {
    const { Category } = models;
    const deletedCategory = await Category.deleteOne({ categoryId });
    if (deletedCategory.deletedCount > 0) {
      return [null, deletedCategory];
    }
    return [new Error('Unable to find category to delete details.')];
  } catch (err) {
    logger.error('Error deleting category by id: ', err);
  }
};
