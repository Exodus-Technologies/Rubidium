'use strict';

import { StatusCodes } from 'http-status-codes';
import logger from '../logger';
import {
  createSubscription,
  deleteSubscription,
  deleteSubscriptions,
  getSubscription,
  getSubscriptionStatus,
  getSubscriptions,
  getUserSubscriptions,
  updateSubscription
} from '../queries/subscriptions';
import { badRequest, internalServerErrorRequest } from '../response-codes';

exports.getSubscriptions = async query => {
  try {
    const subscriptions = await getSubscriptions(query);
    if (subscriptions) {
      return [
        StatusCodes.OK,
        {
          message: 'Successful fetch for subscription with query params.',
          subscriptions
        }
      ];
    }
    return badRequest(`No subscriptions found with selected query params.`);
  } catch (err) {
    logger.error('Error getting all subscriptions: ', err);
    return internalServerErrorRequest('Error getting subscriptions.');
  }
};

exports.getUserSubscriptions = async userId => {
  try {
    const subscription = await getUserSubscriptions(userId);
    if (subscription) {
      return [
        StatusCodes.OK,
        {
          message: 'Successful fetch for subscriptions with user id.',
          subscription
        }
      ];
    }
    return badRequest(`No subscriptions found with user id: ${userId}.`);
  } catch (err) {
    logger.error('Error getting remaining time on subscription: ', err);
    return internalServerErrorRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.getSubscription = async subscriptionId => {
  try {
    const subscription = await getSubscription(subscriptionId);
    if (subscription) {
      return [
        StatusCodes.OK,
        {
          message: 'Successful fetch for subscription with id.',
          subscription
        }
      ];
    }
    return badRequest(`No subscriptions found with id: ${subscriptionId}.`);
  } catch (err) {
    logger.error('Error getting remaining time on subscription: ', err);
    return internalServerErrorRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.getSubscriptionStatus = async query => {
  try {
    const [message] = await getSubscriptionStatus(query);
    if (message) {
      return [
        StatusCodes.OK,
        {
          subscriptionStatus: message
        }
      ];
    }
    return badRequest(`No subscriptions found with query.`);
  } catch (err) {
    logger.error('Error getting remaining time on subscription: ', err);
    return internalServerErrorRequest(
      'Error getting remaining time on subscription.'
    );
  }
};

exports.createSubscription = async payload => {
  try {
    const [error, subscription] = await createSubscription(payload);
    if (subscription) {
      return [
        StatusCodes.CREATED,
        {
          message: 'Successful creation of subscription.',
          subscription
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error creating subscription: ', err);
    return internalServerErrorRequest('Error creating subscription.');
  }
};

exports.updateSubscription = async (subscriptionId, payload) => {
  try {
    const [error, updatedSubscription] = await updateSubscription(
      subscriptionId,
      payload
    );
    if (updatedSubscription) {
      return [
        StatusCodes.OK,
        {
          message: 'Successful update of subscription.',
          updatedSubscription
        }
      ];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error updating subscription: ', err);
    return internalServerErrorRequest('Error updating subscription.');
  }
};

exports.deleteSubscription = async subscriptionId => {
  try {
    const [error, deletedSubscription] = await deleteSubscription(
      subscriptionId
    );
    if (deletedSubscription) {
      return [StatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error deleting subscription: ', err);
    return internalServerErrorRequest('Error deleting subscription.');
  }
};

exports.deleteSubscriptions = async email => {
  try {
    const [error, deletedSubscriptions] = await deleteSubscriptions(email);
    if (deletedSubscriptions) {
      return [StatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    logger.error('Error deleting subscriptions by user: ', err);
    return internalServerErrorRequest('Error deleting subscriptions by user.');
  }
};
