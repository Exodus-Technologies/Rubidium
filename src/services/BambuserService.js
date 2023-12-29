'use strict';

import { StatusCodes } from 'http-status-codes';
import config from '../config';
import { internalServerErrorRequest, badRequest } from '../response-codes';
import {
  createBroadcast,
  updateBroadcast,
  getActiveBroadcast,
  deleteBroadcast
} from '../queries/broadcasts';
import { deleteBroadCastById, uploadLivestream } from '../bambuser';
import { BAMBUSER_BROADCAST_ARCHIVED_STATUS } from '../constants';

const { platforms } = config.sources.bambuser;

exports.getApplicationId = async query => {
  try {
    const { platform } = query;
    const applicationId = platforms[platform];
    if (applicationId) {
      return [
        StatusCodes.OK,
        {
          message: 'Retrieved application id with success.',
          applicationId
        }
      ];
    }
    return badRequest(`No application id found with platform: '${platform}.'`);
  } catch (err) {
    console.log('Error getting applicationId: ', err);
    return internalServerErrorRequest('Error getting applicationId.');
  }
};

exports.webHookCallback = async payload => {
  try {
    const broadcast = await getActiveBroadcast();
    if (!broadcast) {
      const savedBroadcast = await createBroadcast(payload);
      if (savedBroadcast) {
        return [StatusCodes.OK];
      }
    }
    const { broadcastId } = broadcast;
    const updatedBroadcast = await updateBroadcast(broadcastId, payload);
    if (updatedBroadcast) {
      if (payload.type === BAMBUSER_BROADCAST_ARCHIVED_STATUS) {
        const [error, livestream] = await uploadLivestream(broadcastId);
        if (livestream) {
          await deleteBroadCastById(broadcastId);
          await deleteBroadcast(broadcastId);
          return [
            StatusCodes.OK,
            {
              message: 'Livestream data was uploaded to s3 with success',
              livestream
            }
          ];
        } else {
          return badRequest(error.message);
        }
      }
    }
    return [StatusCodes.OK];
  } catch (err) {
    console.log(`Error executing webhook callback: `, err);
    return [StatusCodes.OK];
  }
};
