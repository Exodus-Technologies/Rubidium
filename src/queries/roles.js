'use strict';

import logger from '../logger';
import models from '../models';

export const getRoles = async query => {
  try {
    const { Role } = models;
    const page = +query.page;
    const limit = +query.limit;
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

    return await Role.find(objectFilter)
      .limit(limit)
      .skip(skipIndex)
      .sort(sortString)
      .lean()
      .exec();
  } catch (err) {
    logger.error('Error getting role data from db: ', err);
  }
};

export const getRoleById = async roleId => {
  try {
    const { Role } = models;
    const role = await Role.findOne({ roleId });
    return role;
  } catch (err) {
    logger.error('Error getting catgeory data from db by id: ', err);
  }
};

export const getRoleByName = async name => {
  try {
    const { Role } = models;
    const role = await Role.findOne({ name });
    return role;
  } catch (err) {
    logger.error('Error getting role data from db by name: ', err);
  }
};

export const createRole = async payload => {
  try {
    const { Role } = models;
    const role = await getRoleByName(payload.name);
    if (role) {
      return [new Error('Role with name already exists.')];
    }
    const cat = new Role(payload);
    const createdRole = await cat.save();
    const { description, name, roleId } = createdRole;
    return [null, { description, name, roleId }];
  } catch (err) {
    logger.error('Error saving role data to db: ', err);
  }
};

export const updateRole = async (roleId, name) => {
  try {
    const { Role } = models;
    const filter = { roleId };
    const options = { new: true };
    const update = { name };
    const role = await Role.findOneAndUpdate(filter, update, options);
    return [null, role];
  } catch (err) {
    logger.error('Error updating role data to db: ', err);
  }
};

export const deleteRole = async roleId => {
  try {
    const { Role } = models;
    const deletedRole = await Role.deleteOne({ roleId });
    if (deletedRole.deletedCount > 0) {
      return [null, deletedRole];
    }
    return [new Error('Unable to find role to delete details.')()];
  } catch (err) {
    logger.error('Error deleting role by id: ', err);
  }
};
