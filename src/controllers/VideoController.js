'use strict';

import logger from '../logger';
import { VideoService } from '../services';

exports.getVideos = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await VideoService.getVideos(query);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting vidoes: `, err);
    next(err);
  }
};

exports.getTotal = async (req, res, next) => {
  try {
    const [statusCode, response] = await VideoService.getTotal();
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting total of videos: `, err);
    next(err);
  }
};

exports.getVideo = async (req, res, next) => {
  const { videoId } = req.params;
  try {
    const [statusCode, response] = await VideoService.getVideo(videoId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with getting video by id: ${videoId}: `, err);
    next(err);
  }
};

exports.uploadVideo = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await VideoService.uploadVideo(body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with uploading file to s3: `, err);
    next(err);
  }
};

exports.createVideoMeta = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await VideoService.createVideoMeta(body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with creating meta for file to s3: `, err);
    next(err);
  }
};

exports.updateVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { body } = req;
    const [statusCode, response] = await VideoService.updateVideo(
      videoId,
      body
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating video: `, err);
    next(err);
  }
};

exports.updateViews = async (req, res, next) => {
  try {
    const { videoId } = req.body;
    const [statusCode, response] = await VideoService.updateViews(videoId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating views for video: `, err);
    next(err);
  }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const [statusCode, response] = await VideoService.deleteVideo(videoId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with deleting video by id: ${videoId}: `, err);
    next(err);
  }
};
