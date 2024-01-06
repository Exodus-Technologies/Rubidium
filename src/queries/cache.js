'use strict';

import logger from '../logger';
import models from '../models';

export const getCache = async key => {
  try {
    const { Cache } = models;
    const cache = await Cache.findOne({ key });
    if (cache) {
      return cache.body;
    }
    return null;
  } catch (err) {
    logger.error('Error getting cache data to db: ', err);
  }
};

export const setCache = async payload => {
  try {
    const { Cache } = models;
    const cache = new Cache(payload);
    await cache.save();
    return { ...payload };
  } catch (err) {
    logger.error('Error saving cache data to db: ', err);
  }
};
