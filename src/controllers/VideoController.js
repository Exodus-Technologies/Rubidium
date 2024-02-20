'use strict';

import logger from '../logger';
import { VideoService } from '../services';

exports.initiateUpload = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await VideoService.initiateUpload(body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with initiating multipart upload for file to s3: `,
      err
    );
    next(err);
  }
};

exports.uploadVideo = async (req, res, next) => {
  try {
    const payload = await VideoService.getPayloadFromFormRequest(req);
    const [statusCode, response] = await VideoService.uploadVideo(payload);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with uploading file to s3: `, err);
    next(err);
  }
};

exports.completeUpload = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, response] = await VideoService.completeUpload(body);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with completing multipart upload for file to s3: `,
      err
    );
    next(err);
  }
};

exports.createPresignedUrls = async (req, res, next) => {
  try {
    const { fileName } = req.body;
    const [statusCode, response] = await VideoService.createPresignedUrls(
      fileName
    );
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(
      `Error with creating presigned urls for upload for file to s3: `,
      err
    );
    next(err);
  }
};

exports.createVideoMetadata = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await VideoService.createVideoMetadata(body);
    res.status(statusCode).send(payload);
  } catch (err) {
    logger.error(`Error with manual uploading file to s3: `, err);
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

exports.updateVideo = async (req, res, next) => {
  try {
    const payload = await VideoService.getPayloadFromFormRequest(req);
    const [statusCode, response] = await VideoService.updateVideo(payload);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with updating video: `, err);
    next(err);
  }
};

exports.deleteVideoById = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const [statusCode, response] = await VideoService.deleteVideoById(videoId);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error(`Error with deleting video by id: ${videoId}: `, err);
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
