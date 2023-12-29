'use strict';

import { StatusCodes } from 'http-status-codes';
import {
  getActiveBroadcast,
  deleteBroadcast,
  getBroadcasts
} from '../queries/broadcasts';
import { internalServerErrorRequest, badRequest } from '../response-codes';

exports.getActiveBroadcast = async () => {
  try {
    const broadcast = await getActiveBroadcast();
    if (broadcast) {
      return [StatusCodes.OK, broadcast];
    } else {
      return badRequest(`No active broadcast avaiable.`);
    }
  } catch (err) {
    console.log('Error getting active broadcast: ', err);
    return internalServerErrorRequest('Error getting active broadcast.');
  }
};

exports.getBroadcasts = async query => {
  try {
    const broadcasts = await getBroadcasts(query);
    if (broadcasts) {
      return [
        StatusCodes.OK,
        { message: 'Broadcasts fetched from db with success', broadcasts }
      ];
    } else {
      return badRequest(`No broadcasts found with selected query params.`);
    }
  } catch (err) {
    console.log('Error getting all broadcasts: ', err);
    return internalServerErrorRequest('Error getting broadcasts.');
  }
};

exports.deleteBroadcast = async broadcastId => {
  try {
    const [error, deletedBroadcast] = await deleteBroadcast(broadcastId);
    if (deletedBroadcast) {
      return [StatusCodes.NO_CONTENT];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error deleting broadcast: ', err);
    return internalServerErrorRequest('Error deleting broadcast.');
  }
};
