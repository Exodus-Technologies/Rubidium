'use strict';

import models from '../models';
import logger from '../logger';

export const getVideos = async query => {
  try {
    const { Video } = models;
    const page = +query.page;
    const limit = +query.limit;
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

    const videos = await Video.find(objectFilter)
      .limit(limit)
      .skip(skipIndex)
      .sort(sortString)
      .lean()
      .exec();
    const total = await Video.find(objectFilter).count();
    return videos.map(video => {
      return {
        ...video,
        total,
        pages: Math.ceil(total / limit)
      };
    });
  } catch (err) {
    logger.error('Error getting video data from db: ', err);
  }
};

export const getTotal = async () => {
  try {
    const { Video } = models;
    const total = await Video.count();
    return total;
  } catch (err) {
    logger.error('Error getting total video data from db: ', err);
  }
};

export const getVideoByTitle = async title => {
  try {
    const { Video } = models;
    const video = await Video.findOne({ title });
    return video;
  } catch (err) {
    logger.error('Error getting video data from db by title: ', err);
  }
};

export const getVideoById = async videoId => {
  try {
    const { Video } = models;
    const video = await Video.findOne({ videoId });
    return video;
  } catch (err) {
    logger.error('Error getting video data from db by id: ', err);
  }
};

export const createVideo = async payload => {
  try {
    const { Video } = models;
    const video = new Video(payload);
    const createdVideo = await video.save();
    return createdVideo;
  } catch (err) {
    logger.error('Error saving video data to db: ', err);
  }
};

export const updateVideo = async payload => {
  try {
    const { Video } = models;
    const { videoId } = payload;
    const filter = { videoId };
    const options = { upsert: true };
    const update = { ...payload };

    await Video.findOneAndUpdate(filter, update, options);
  } catch (err) {
    logger.error('Error updating video data to db: ', err);
  }
};

export const updateVideoViews = async videoId => {
  try {
    const { Video } = models;
    return await Video.findOneAndUpdate(
      { videoId },
      { $inc: { videoViews: 1 } }
    );
  } catch (err) {
    logger.error('Error updating video views: ', err);
  }
};

export const deleteVideoById = async videoId => {
  try {
    const { Video } = models;
    const deletedVideo = await Video.deleteOne({ videoId });
    if (deletedVideo.deletedCount > 0) {
      return [null, deletedVideo];
    }
    return [new Error('Unable to find video to delete details.')];
  } catch (err) {
    logger.error('Error deleting video by id: ', err);
  }
};
