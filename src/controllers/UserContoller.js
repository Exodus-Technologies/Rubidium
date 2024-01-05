'use strict';

import logger from '../logger';
import { UserService } from '../services';

exports.getUsers = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await UserService.getUsers(query);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error getting users: `, err);
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const [statusCode, response] = await UserService.getUser(userId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error getting user: ${userId}: `, err);
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await UserService.createUser(body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error creating user: `, err);
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { body } = req;
    const [statusCode, response] = await UserService.updateUser(userId, body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error updating user: ${userId}: `, err);
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const [statusCode, response] = await UserService.deleteUser(userId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error deleting user: ${userId}: `, err);
    next(err);
  }
};
