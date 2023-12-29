'use strict';

import { StatusCodes } from 'http-status-codes';
import config from '../config';
import SubscriptionService from './SubscriptionService';
import { badRequest, internalServerErrorRequest } from '../response-codes';
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUserById
} from '../queries/users';

exports.getUsers = async query => {
  try {
    const [_, users] = await getUsers(query);
    if (users) {
      return [
        StatusCodes.OK,
        {
          message: 'Fetcing of users action was successful.',
          users
        }
      ];
    } else {
      return badRequest(`No users found with selected query params.`);
    }
  } catch (err) {
    console.log('Error getting all users: ', err);
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
    console.log('Error getting user: ', err);
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
    console.log(`Error creating user: `, err);
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
    console.log('Error updating user: ', err);
    return internalServerErrorRequest('Error updating user.');
  }
};

exports.deleteUser = async userId => {
  const { purgeSubscriptions } = config;
  try {
    const [error, user] = await getUserById(userId);
    if (user) {
      if (purgeSubscriptions) {
        SubscriptionService.deleteSubscriptions(userId);
      }
      const [error, deletedUser] = await deleteUserById(userId);
      if (deletedUser) {
        return [StatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error deleting user by id: ', err);
    return internalServerErrorRequest('Error deleting user by id.');
  }
};
