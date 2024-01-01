'use strict';

import models from '../models';
import logger from '../logger';

export const getBroadcasts = async query => {
  try {
    const { Broadcast } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;

    const filter = [];
    for (const [key, value] of Object.entries(query)) {
      if (key != 'page' && key != 'limit' && key != 'sort') {
        filter.push({ [key]: { $regex: value, $options: 'i' } });
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

    const broadcasts = await Broadcast.find(objectFilter)
      .limit(limit)
      .skip(skipIndex)
      .sort(sortString)
      .lean()
      .exec();

    const total = await Broadcast.find(objectFilter).count();

    return broadcasts.map(broadcast => {
      return {
        ...broadcast,
        total,
        pages: Math.ceil(total / limit)
      };
    });
  } catch (err) {
    logger.error('Error getting broadcast data from db: ', err);
  }
};

export const getActiveBroadcast = async () => {
  try {
    const { Broadcast } = models;
    const broadcast = await Broadcast.findOne({ isActive: true });
    return broadcast;
  } catch (err) {
    logger.error('Error getting most latest active broadcast: ', err);
  }
};

export const getBroadcastById = async eventId => {
  try {
    const { Broadcast } = models;
    const broadcast = await Broadcast.findOne({ eventId });
    return broadcast;
  } catch (err) {
    logger.error('Error getting broadcast by id: ', err);
  }
};

export const createBroadcast = async payload => {
  try {
    const { Broadcast } = models;
    const { collection } = payload;
    const body = {
      ...payload,
      collectionType: collection
    };
    const broadcast = new Broadcast(body);
    await broadcast.save();
    return broadcast;
  } catch (err) {
    logger.error('Error saving broadcast data to db: ', err);
  }
};

export const updateBroadcast = async (broadcastId, livestream) => {
  try {
    const { Broadcast } = models;
    const { collection, payload } = livestream;
    const { type } = payload;
    const filter = { broadcastId };
    const options = { new: true };
    const update = {
      ...livestream,
      playerUrl: payload.resourceUri,
      ...(collection && { collectionType: collection }),
      ...(type === 'archived' && { isActive: false })
    };
    const broadcast = await Broadcast.findOneAndUpdate(filter, update, options);
    return broadcast;
  } catch (err) {
    logger.error('Error updating broadcast status: ', err);
  }
};

export const deleteBroadcast = async broadcastId => {
  try {
    const { Broadcast } = models;
    const deletedBroadcast = await Broadcast.deleteOne({
      'payload.id': broadcastId
    });
    if (deletedBroadcast.deletedCount > 0) {
      return [null, deletedBroadcast];
    }
    return [new Error('Unable to find broadcast to delete details.')];
  } catch (err) {
    logger.error('Error deleting video by id: ', err);
  }
};
