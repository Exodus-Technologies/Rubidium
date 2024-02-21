'use strict';

import { StatusCodes } from 'http-status-codes';
import logger from '../logger';
import {
  createPermission,
  deletePermissionById,
  getPermissionById,
  getPermissions,
  updatePermission
} from '../queries/permissions';
import { badRequest, internalServerErrorRequest } from '../response-codes';

exports.getPermissions = async query => {
  try {
    const permissions = await getPermissions(query);
    if (permissions) {
      return [
        StatusCodes.OK,
        { message: 'Permissions fetched from db with success', permissions }
      ];
    } else {
      return badRequest(
        `Unable to find permissions that matched the search criteria.`
      );
    }
  } catch (err) {
    logger.error('Error getting permissions: ', err);
    return internalServerErrorRequest('Error getting permissions.');
  }
};

exports.getPermission = async permissionId => {
  try {
    const permission = await getPermissionById(permissionId);
    if (permission) {
      return [
        StatusCodes.OK,
        { message: 'Permission fetched from db with success', permission }
      ];
    } else {
      return badRequest(`No permission found with id provided.`);
    }
  } catch (err) {
    logger.error('Error getting permission by id ', err);
    return internalServerErrorRequest('Error getting permission by id.');
  }
};

exports.createPermission = async payload => {
  try {
    const [error, permission] = await createPermission(payload);
    if (permission) {
      return [
        StatusCodes.CREATED,
        { message: 'Permission created with success.', permission }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error creating new permission: ', err);
    return internalServerErrorRequest('Error creating new permission.');
  }
};

exports.updatePermission = async (permissionId, name) => {
  try {
    const [error, permission] = await updatePermission(permissionId, name);
    if (permission) {
      return [
        StatusCodes.OK,
        { message: 'Permission updated with success.', permission }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error updating existing permission: ', err);
    return internalServerErrorRequest('Error updating existing permission.');
  }
};

exports.deletePermissionById = async permissionId => {
  try {
    const [error, deletedPermission] = await deletePermissionById(permissionId);
    if (deletedPermission) {
      return [StatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error deleting permission by id: ', err);
    return internalServerErrorRequest('Error deleting permission by id.');
  }
};
