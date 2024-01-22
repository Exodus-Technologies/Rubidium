'use strict';

import logger from '../logger';
import models from '../models';

export const getPermissions = async query => {
  try {
    const { Permission } = models;
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

    return await Permission.find(objectFilter)
      .limit(limit)
      .skip(skipIndex)
      .sort(sortString)
      .lean()
      .exec();
  } catch (err) {
    logger.error('Error getting permission data from db: ', err);
  }
};

export const getPermissionById = async permissionId => {
  try {
    const { Permission } = models;
    const permission = await Permission.findOne({ permissionId });
    return permission;
  } catch (err) {
    logger.error('Error getting permission data from db by id: ', err);
  }
};

export const getPermissionByName = async name => {
  try {
    const { Permission } = models;
    const permission = await Permission.findOne({ name });
    return permission;
  } catch (err) {
    logger.error('Error getting permission data from db by name: ', err);
  }
};

export const createPermission = async payload => {
  try {
    const { Permission } = models;
    const permission = await Permission.findOne({ name: payload.name });
    if (permission) {
      return [new Error('permission with name already exists.')];
    }
    const perm = new Permission(payload);
    const createdPermission = await perm.save();
    const { description, name, permissionId } = createdPermission;
    return [null, { description, name, permissionId }];
  } catch (err) {
    logger.error('Error saving permission data to db: ', err);
  }
};

export const updatePermission = async (permissionId, name) => {
  try {
    const { Permission } = models;
    const filter = { permissionId };
    const options = { new: true };
    const update = { name };
    const permission = await Permission.findOneAndUpdate(
      filter,
      update,
      options
    );
    return [null, permission];
  } catch (err) {
    logger.error('Error updating permission data to db: ', err);
  }
};

export const deletePermissionById = async permissionId => {
  try {
    const { Permission } = models;
    const deletedPermission = await Permission.deleteOne({ permissionId });
    if (deletedPermission.deletedCount > 0) {
      return [null, deletedPermission];
    }
    return [new Error('Unable to find permission to delete details.')()];
  } catch (err) {
    logger.error('Error deleting permission by id: ', err);
  }
};
