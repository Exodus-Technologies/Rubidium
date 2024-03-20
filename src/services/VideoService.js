'use strict';

import getVideoDurationInSeconds from 'get-video-duration';
import { StatusCodes } from 'http-status-codes';
import {
  getThumbnailDistributionURI,
  getVideoDistributionURI
} from '../aws/cloudFront';
import {
  copyThumbnailObject,
  copyVideoObject,
  deleteThumbnailByKey,
  deleteVideoByKey
} from '../aws/s3';
import logger from '../logger';
import {
  createVideo,
  deleteVideo,
  getTotal,
  getVideo,
  getVideoByTitle,
  getVideos,
  updateVideo,
  updateVideoViews
} from '../queries/videos';
import { badRequest, internalServerErrorRequest } from '../response-codes';
import { convertArgToBoolean } from '../utilities/boolean';
import { fancyTimeFormat } from '../utilities/time';

exports.getVideos = async query => {
  try {
    const videos = await getVideos(query);
    if (videos) {
      return [
        StatusCodes.OK,
        { message: 'Videos fetched from db with success', videos }
      ];
    } else {
      return badRequest(`No videos found with selected query params.`);
    }
  } catch (err) {
    logger.error('Error getting all videos: ', err);
    return internalServerErrorRequest('Error getting videos.');
  }
};

exports.getVideo = async videoId => {
  try {
    const video = await getVideo(videoId);
    if (video) {
      return [
        StatusCodes.OK,
        { message: 'Video fetched from db with success', video }
      ];
    } else {
      return badRequest(`No video found with id provided.`);
    }
  } catch (err) {
    logger.error('Error getting video by id ', err);
    return internalServerErrorRequest('Error getting video by id.');
  }
};

exports.getTotal = async () => {
  try {
    const total = await getTotal();
    if (total) {
      return [
        StatusCodes.OK,
        {
          message: 'Successful fetch for get total video with query params.',
          videoCount: total
        }
      ];
    }
    return badRequest(`No video total found with selected query params.`);
  } catch (err) {
    logger.error('Error getting total for all videos: ', err);
    return internalServerErrorRequest('Error getting total for all videos.');
  }
};

exports.uploadVideo = async archive => {
  try {
    const {
      title,
      description,
      url,
      videoKey,
      thumbnail,
      thumbnailKey,
      categories,
      duration,
      isAvailableForSale
    } = archive;

    const video = await getVideoByTitle(title);

    if (video) {
      return badRequest(`Please provide another title for the video.`);
    } else {
      const body = {
        title,
        description,
        videoKey,
        ...(categories && {
          categories: categories.split(',').map(item => item.trim())
        }),
        url: getVideoDistributionURI(videoKey) || url,
        thumbnailKey,
        duration: fancyTimeFormat(duration),
        thumbnail: getThumbnailDistributionURI(thumbnailKey) || thumbnail,
        isAvailableForSale: convertArgToBoolean(isAvailableForSale)
      };

      const video = await createVideo(body);
      if (video) {
        return [
          StatusCodes.CREATED,
          { message: 'Video uploaded to s3 with success', video }
        ];
      } else {
        return badRequest('Unable to save video with metadata.');
      }
    }
  } catch (err) {
    logger.error(`Error uploading video to s3: `, err);
    return internalServerErrorRequest('Error uploading video to s3.');
  }
};

exports.createVideoMeta = async archive => {
  try {
    const {
      title,
      description,
      url,
      videoKey,
      thumbnail,
      thumbnailKey,
      categories,
      isAvailableForSale
    } = archive;

    const duration = await getVideoDurationInSeconds(url);

    const body = {
      title,
      description,
      videoKey,
      ...(categories && {
        categories: categories.split(',').map(item => item.trim())
      }),
      url: getVideoDistributionURI(videoKey) || url,
      thumbnailKey,
      duration: fancyTimeFormat(duration),
      thumbnail: getThumbnailDistributionURI(thumbnailKey) || thumbnail,
      isAvailableForSale: convertArgToBoolean(isAvailableForSale)
    };

    return [
      StatusCodes.CREATED,
      { message: 'Video metadata created with success', body }
    ];
  } catch (err) {
    logger.error(`Error uploading video to s3: `, err);
    return internalServerErrorRequest('Error uploading video to s3.');
  }
};

exports.updateViews = async videoId => {
  try {
    const video = await updateVideoViews(videoId);
    if (video) {
      const { totalViews, title } = video;
      return [
        StatusCodes.OK,
        {
          message: `Video with title '${title.trim()}' has ${totalViews} views.`,
          views: totalViews
        }
      ];
    }
    return badRequest(`No videos found to update clicks.`);
  } catch (err) {
    logger.error('Error updating views on video: ', err);
    return internalServerErrorRequest('Error updating views.');
  }
};

exports.updateVideo = async (videoId, payload) => {
  try {
    const {
      title,
      description,
      url,
      videoKey,
      thumbnail,
      thumbnailKey,
      categories,
      isAvailableForSale
    } = payload;

    const video = await getVideo(videoId);

    if (video) {
      if (videoKey !== video.videoKey) {
        await copyVideoObject(video.videoKey, videoKey);
      }
      if (thumbnailKey !== video.thumbnailKey) {
        await copyThumbnailObject(video.thumbnailKey, thumbnailKey);
      }

      const duration = await getVideoDurationInSeconds(url);

      const body = {
        title,
        videoId,
        description,
        videoKey,
        ...(categories && {
          categories: categories.split(',').map(item => item.trim())
        }),
        url: getVideoDistributionURI(videoKey) || url,
        thumbnailKey,
        duration: fancyTimeFormat(duration),
        thumbnail: getThumbnailDistributionURI(thumbnailKey) || thumbnail,
        isAvailableForSale: convertArgToBoolean(isAvailableForSale)
      };
      await updateVideo(body);
      deleteVideoByKey(video.videoKey);
      deleteThumbnailByKey(video.thumbnailKey);
      return [
        StatusCodes.OK,
        {
          message: 'Video updated to s3 with success',
          video: {
            ...body
          }
        }
      ];
    } else {
      return badRequest(`No video was found to update by videoId provided.`);
    }
  } catch (err) {
    logger.error(`Error updating video metadata: `, err);
    return internalServerErrorRequest('Error updating video metadata.');
  }
};

exports.deleteVideo = async videoId => {
  try {
    const video = await getVideo(videoId);
    if (video) {
      const { videoKey, thumbnailKey } = video;
      deleteVideoByKey(videoKey);
      deleteThumbnailByKey(thumbnailKey);
      const [error, deletedVideo] = await deleteVideo(videoId);
      if (deletedVideo) {
        return [StatusCodes.NO_CONTENT];
      }
      return badRequest(error.message);
    }
    return badRequest(`No video found with id provided.`);
  } catch (err) {
    logger.error('Error deleting video by id: ', err);
    return internalServerErrorRequest('Error deleting video by id.');
  }
};
