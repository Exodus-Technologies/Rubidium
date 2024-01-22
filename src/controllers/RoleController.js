'use strict';

import logger from '../logger';
import { RoleService } from '../services';

exports.getRoles = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await RoleService.getRoles(query);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with getting roles: `, err);
    next(err);
  }
};

exports.getRole = async (req, res, next) => {
  const { roleId } = req.params;
  try {
    const [statusCode, response] = await RoleService.getRole(roleId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting role metadata by id: ${roleId}: `, err);
    next(err);
  }
};

exports.createRole = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await RoleService.createRole(body);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with creating new role: `, err);
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const { name } = req.body;
    const [statusCode, response] = await RoleService.updateRole(roleId, name);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating role: `, err);
    next(err);
  }
};

exports.deleteRole = async (req, res, next) => {
  const { roleId } = req.params;
  try {
    const [statusCode, response] = await RoleService.deleteRole(roleId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with deleting role by id: ${roleId}: `, err);
    next(err);
  }
};
