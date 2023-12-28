'use strict';

import models from '../models';
import { stringToBoolean } from '../utilities/boolean';

export const getUsers = async query => {
  try {
    const { User } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;

    const queryOps = {
      __v: 0,
      _id: 0,
      password: 0,
      createdAt: 0,
      updatedAt: 0
    };

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

    const users = await User.find(objectFilter, queryOps)
      .limit(limit)
      .skip(skipIndex)
      .sort(sortString)
      .lean()
      .exec();
    const total = await User.find(objectFilter, queryOps).count();
    const result = users.map(user => ({
      ...user,
      total,
      pages: Math.ceil(total / limit)
    }));
    return [null, result];
  } catch (err) {
    console.log('Error getting user data from db: ', err);
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
    console.log('Error getting user data to db: ', err);
  }
};

export const getUserByEmail = async email => {
  const opts = {
    __v: 0,
    createdAt: 0,
    updatedAt: 0
  };
  try {
    const { User } = models;
    const user = await User.findOne({ email }, opts);
    if (user) {
      return [null, user];
    }
    return [new Error('Unable to find user with email provided.')];
  } catch (err) {
    console.log('Error getting user data to db: ', err);
    return [new Error('No user found associated with email provided.')];
  }
};

export const createUser = async payload => {
  try {
    const { User } = models;
    const { email, isAdmin } = payload;
    const user = await User.findOne({ email });
    if (!user) {
      const body = { ...payload, isAdmin: stringToBoolean(isAdmin) };
      const user = new User(body);
      const createdUser = await user.save();
      return [null, createdUser];
    }
    return [Error('User with email already exists.')];
  } catch (err) {
    console.log('Error saving user data to db: ', err);
  }
};

export const updateUser = async (userId, payload) => {
  try {
    const { User } = models;
    const { email, isAdmin } = payload;
    const user = await User.findOne({ email });
    if (user) {
      return [Error('Unable to change email. Email already in use.')];
    }
    const filter = { userId };
    const options = { new: true };
    const update = { ...payload, isAdmin: stringToBoolean(isAdmin) };
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
    console.log('Error updating user data to db: ', err);
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
    console.log('Error deleting user data from db: ', err);
  }
};

export const getCodeByUserId = async userId => {
  try {
    const { Code } = models;
    const code = await Code.findOne({ userId });
    if (code) {
      return [null, code];
    }
    return [new Error('Unable to find code associated with user.')];
  } catch (err) {
    console.log('Error getting otpCode for user data to db: ', err);
  }
};

export const createOtpCode = async payload => {
  try {
    const { Code } = models;
    const { userId } = payload;
    const code = await Code.findOne({ userId });
    if (!code) {
      const newCode = new Code(payload);
      const createdCode = await newCode.save();
      return [null, createdCode];
    }
    return [Error('Code with the userId provided already exists.')];
  } catch (err) {
    console.log('Error saving code data to db: ', err);
  }
};

export const deleteCode = async userId => {
  try {
    const { Code } = models;
    const deletedCode = await Code.deleteOne({ userId });
    if (deletedCode.deletedCount > 0) {
      return [null, deletedCode];
    }
    return [new Error('Unable to find code to delete details.')];
  } catch (err) {
    console.log('Error deleting code data from db: ', err);
  }
};

export const saveTransaction = async payload => {
  try {
    const { Transaction } = models;
    const transaction = new Transaction(payload);
    await transaction.save();
  } catch (err) {
    console.log('Error saving transaction data to db: ', err);
  }
};

export const verifyOptCode = async (email, otpCode) => {
  try {
    const { Code } = models;
    const code = await Code.findOne({ email });
    if (code.otpCode === otpCode) {
      return [null, true];
    }
    return [Error('Code supplied was incorrect.')];
  } catch (err) {
    console.log(`Error verifying otpCode: ${otpCode}: `, err);
  }
};
