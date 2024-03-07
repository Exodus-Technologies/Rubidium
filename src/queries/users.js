'use strict';

import logger from '../logger';
import models from '../models';
import { convertArgToBoolean } from '../utilities/boolean';

export const getUsers = async query => {
  try {
    const { User } = models;
    const page = +query.page;
    const limit = +query.limit;
    const skipIndex = (page - 1) * limit;

    const filter = [];
    for (const [key, value] of Object.entries(query)) {
      if (
        key != 'page' &&
        key != 'limit' &&
        key != 'sort' &&
        key != 'isAdmin' &&
        key != 'userId'
      ) {
        filter.push({ [key]: { $regex: value, $options: 'i' } });
      }
      if (key == 'isAdmin' || key == 'userId') {
        filter.push({ [key]: value });
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

    const users = await User.find(objectFilter)
      .limit(limit)
      .skip(skipIndex)
      .sort(sortString)
      .lean()
      .exec();
    const total = await User.find(objectFilter).count();
    const result = users.map(user => ({
      ...user,
      total,
      pages: Math.ceil(total / limit)
    }));
    if (result) {
      return [null, result];
    }
    return [new Error('No users found with selected query params')];
  } catch (err) {
    logger.error('Error getting user data from db: ', err);
  }
};

export const getUserById = async userId => {
  try {
    const { User } = models;
    const user = await User.findOne({ userId });
    if (user) {
      return [null, user];
    }
    return [new Error('User with id does not exist.')];
  } catch (err) {
    logger.error('Error getting user data to db: ', err);
  }
};

export const getUserByEmail = async email => {
  try {
    const { User } = models;
    const user = await User.findOne({ email });
    if (user) {
      return [null, user];
    }
    return [new Error('Unable to find user with email provided.')];
  } catch (err) {
    logger.error('Error getting user data to db: ', err);
    return [new Error('No user found associated with email provided.')];
  }
};

export const createUser = async payload => {
  try {
    const { User } = models;
    const { email, isAdmin } = payload;
    const user = await User.findOne({ email });
    if (user) {
      return [new Error('User with email already exists.')];
    }
    const body = { ...payload, isAdmin: convertArgToBoolean(isAdmin) };
    const newUser = new User(body);
    const createdUser = await newUser.save();
    return [null, createdUser];
  } catch (err) {
    logger.error('Error saving user data to db: ', err);
  }
};

export const updateUser = async (userId, payload) => {
  try {
    const { User } = models;
    const { email, isAdmin } = payload;
    const user = await User.findOne({ email });
    if (user) {
      return [new Error('Unable to change email. Email already in use.')];
    }
    const filter = { userId };
    const options = { new: true };
    const update = { ...payload, isAdmin: convertArgToBoolean(isAdmin) };
    const updatedUser = await User.findOneAndUpdate(filter, update, options);
    if (updatedUser) {
      const { email, fullName, city, state, isAdmin } = updatedUser;
      const user = {
        email,
        fullName,
        city,
        state,
        isAdmin
      };
      return [null, user];
    } else {
      return [new Error('Unable to update user details.')];
    }
  } catch (err) {
    logger.error('Error updating user data to db: ', err);
  }
};

export const updateLastLogin = async userId => {
  const { User } = models;
  try {
    const filter = { userId };
    const update = { lastLoggedIn: new Date() };
    const options = { new: true };
    const user = await User.findOneAndUpdate(filter, update, options);
    return [null, user];
  } catch (err) {
    console.log(err);
    return [new Error('Unable to update user last login details.')];
  }
};

export const deleteUserById = async userId => {
  try {
    const { User } = models;
    const deletedUser = await User.deleteOne({ userId });
    if (deletedUser.deletedCount > 0) {
      return [null, deletedUser];
    }
    return [new Error('Unable to find user to delete details.')];
  } catch (err) {
    logger.error('Error deleting user data from db: ', err);
  }
};
