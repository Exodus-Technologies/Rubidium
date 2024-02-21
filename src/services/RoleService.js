'use strict';

import { StatusCodes } from 'http-status-codes';
import logger from '../logger';
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole
} from '../queries/roles';
import { badRequest, internalServerErrorRequest } from '../response-codes';

exports.getRoles = async query => {
  try {
    const roles = await getRoles(query);
    if (roles) {
      return [
        StatusCodes.OK,
        { message: 'Roles fetched from db with success', roles }
      ];
    } else {
      return badRequest(
        `Unable to find roles that matched the search criteria.`
      );
    }
  } catch (err) {
    logger.error('Error getting roles: ', err);
    return internalServerErrorRequest('Error getting roles.');
  }
};

exports.getRole = async roleId => {
  try {
    const role = await getRoleById(roleId);
    if (role) {
      return [
        StatusCodes.OK,
        { message: 'Role fetched from db with success', role }
      ];
    } else {
      return badRequest(`No role found with id provided.`);
    }
  } catch (err) {
    logger.error('Error getting role by id ', err);
    return internalServerErrorRequest('Error getting role by id.');
  }
};

exports.createRole = async payload => {
  try {
    const [error, role] = await createRole(payload);
    if (role) {
      return [
        StatusCodes.CREATED,
        { message: 'Role created with success.', role }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error creating new role: ', err);
    return internalServerErrorRequest('Error creating new role.');
  }
};

exports.updateRole = async (roleId, name) => {
  try {
    const [error, role] = await updateRole(roleId, name);
    if (role) {
      return [StatusCodes.OK, { message: 'Role updated with success.', role }];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error updating existing role: ', err);
    return internalServerErrorRequest('Error updating existing role.');
  }
};

exports.deleteRole = async roleId => {
  try {
    const [error, deletedRole] = await deleteRole(roleId);
    if (deletedRole) {
      return [StatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error deleting role by id: ', err);
    return internalServerErrorRequest('Error deleting role by id.');
  }
};
