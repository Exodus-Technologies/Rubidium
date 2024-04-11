'use strict';

import { StatusCodes } from 'http-status-codes';
import config from '../config';
import logger from '../logger';
import {
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUser
} from '../queries/users';
import { badRequest, internalServerErrorRequest } from '../response-codes';
import SubscriptionService from './SubscriptionService';

exports.getUsers = async query => {
  try {
    const [error, users] = await getUsers(query);
    if (users) {
      return [
        StatusCodes.OK,
        {
          message: 'Fetcing of users action was successful.',
          users
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error('Error getting all users: ', err);
    return internalServerErrorRequest('Error getting users.');
  }
};

exports.getUser = async userId => {
  try {
    const [error, user] = await getUserById(userId);
    if (user) {
      return [
        StatusCodes.OK,
        {
          message: 'User was successfully fetched.',
          user
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error getting user: ', err);
    return internalServerErrorRequest('Error getting user.');
  }
};

exports.createUser = async payload => {
  try {
    const [error, user] = await createUser(payload);
    if (user) {
      return [
        StatusCodes.CREATED,
        {
          message: 'User created with success.',
          user
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    logger.error(`Error creating user: `, err);
    return internalServerErrorRequest('Error creating user.');
  }
};

exports.updateUser = async (userId, payload) => {
  try {
    const [error, updatedUser] = await updateUser(userId, payload);
    if (updatedUser) {
      return [
        StatusCodes.OK,
        { message: 'User was successfully updated.', user: updatedUser }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error updating user: ', err);
    return internalServerErrorRequest('Error updating user.');
  }
};

exports.deleteUser = async userId => {
  const { PURGE_SUBSCRIPTIONS } = config;
  try {
    const [error, user] = await getUserById(userId);
    if (user) {
      if (PURGE_SUBSCRIPTIONS) {
        const { email } = user;
        SubscriptionService.deleteSubscriptions(email);
      }
      const [error, deletedUser] = await deleteUserById(userId);
      if (deletedUser) {
        return [StatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error deleting user by id: ', err);
    return internalServerErrorRequest('Error deleting user by id.');
  }
};
