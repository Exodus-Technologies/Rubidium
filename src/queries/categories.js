'use strict';

import models from '../models';

import { queryOps } from './';

export const getCategories = async query => {
  try {
    const { Category } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;
    return await Category.find(query, queryOps)
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .exec();
  } catch (err) {
    console.log('Error getting category data from db: ', err);
  }
};

export const getCategoryById = async categoryId => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ categoryId });
    return category;
  } catch (err) {
    console.log('Error getting catgeory data from db by id: ', err);
  }
};

export const getCategoryByName = async name => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name });
    return category;
  } catch (err) {
    console.log('Error getting category data from db by name: ', err);
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
    console.log('Error saving video data to db: ', err);
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
    console.log('Error updating category data to db: ', err);
  }
};

export const deleteCategoryById = async categoryId => {
  try {
    const { Category } = models;
    const deletedCategory = await Category.deleteOne({ categoryId });
    return deletedCategory;
  } catch (err) {
    console.log('Error deleting video by id: ', err);
  }
};
