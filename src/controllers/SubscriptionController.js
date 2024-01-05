'use strict';

import logger from '../logger';
import { SubscriptionService } from '../services';

exports.getSubscriptions = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await SubscriptionService.getSubscriptions(
      query
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting subscriptions: `, err);
    next(err);
  }
};

exports.getUserSubscriptions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const [statusCode, response] =
      await SubscriptionService.getUserSubscriptions(userId);
    res.status(statusCode).send(response);
  } catch (err) {
    next(err);
  }
};

exports.getSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const [statusCode, response] = await SubscriptionService.getSubscription(
      subscriptionId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with getting subscription by id: ${subscriptionId} `,
      err
    );
    next(err);
  }
};

exports.getSubscriptionStatus = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] =
      await SubscriptionService.getSubscriptionStatus(query);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting subscription status: `, err);
    next(err);
  }
};

exports.createSubscription = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await SubscriptionService.createSubscription(
      body
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with creating subscription: `, err);
    next(err);
  }
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const { body } = req;
    const { subscriptionId } = req.params;
    const [statusCode, response] = await SubscriptionService.updateSubscription(
      subscriptionId,
      body
    );
    return res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating subscription: `, err);
    next(err);
  }
};

exports.deleteSubscription = async (req, res, next) => {
  const { subscriptionId } = req.params;
  try {
    const [statusCode, response] = await SubscriptionService.deleteSubscription(
      subscriptionId
    );
    return res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with deleting by id subscription: ${subscriptionId} `,
      err
    );
    next(err);
  }
};

exports.deleteSubscriptions = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const [statusCode, response] =
      await SubscriptionService.deleteSubscriptions(userId);
    return res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with deleting subscriptions by user id: ${userId} `,
      err
    );
    next(err);
  }
};
