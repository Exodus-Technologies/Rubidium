'use strict';

import formidable from 'formidable';
import { StatusCodes } from 'http-status-codes';
import {
  abortMultipartUpload,
  completeMultipartUpload,
  copyThumbnailObject,
  copyVideoObject,
  createThumbnailPresignedUrl,
  createThumbnailS3Bucket,
  createVideoPresignedUrl,
  createVideoS3Bucket,
  deleteThumbnailByKey,
  deleteVideoByKey,
  doesThumbnailObjectExist,
  doesThumbnailS3BucketExist,
  doesVideoObjectExist,
  doesVideoS3BucketExist,
  getCreateMultipartUploadId,
  getThumbnailDistributionURI,
  getVideoDistributionURI,
  uploadVideoArchiveToS3Location
} from '../aws';
import {
  MAX_FILE_SIZE_VIDEO,
  THUMBNAIL_MIME_TYPE,
  VIDEO_MIME_TYPE
} from '../constants';
import logger from '../logger';
import {
  createVideo,
  deleteVideoById,
  getTotal,
  getVideoById,
  getVideoByTitle,
  getVideos,
  updateVideo,
  updateVideoViews
} from '../queries/videos';
import { badRequest, internalServerErrorRequest } from '../response-codes';
import { stringToBoolean } from '../utilities/boolean';
import { isEmpty } from '../utilities/objects';
import { removeSpaces } from '../utilities/strings';
import { fancyTimeFormat } from '../utilities/time';

exports.getPayloadFromFormRequest = async req => {
  const form = formidable({
    multiples: true,
    maxFileSize: MAX_FILE_SIZE_VIDEO
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      if (isEmpty(fields)) reject('Form is empty.');
      const file = {
        ...fields,
        isAvailableForSale: stringToBoolean(fields.isAvailableForSale),
        key: removeSpaces(fields.title)
      };
      if (!isEmpty(files)) {
        const {
          filepath: videoPath,
          mimetype: videoType,
          size: videoSize
        } = files['file'];
        const {
          filepath: thumbnailPath,
          mimetype: thumbnailType,
          size: thumbnailSize
        } = files['thumbnail'];
        resolve({
          ...file,
          videoPath,
          videoType,
          thumbnailPath,
          thumbnailType,
          videoSize,
          thumbnailSize
        });
      } else {
        resolve(file);
      }
    });
    form.on('error', err => {
      logger.info('Error on form parse: ', err);
    });
    form.on('end', () => {
      logger.info('Form is finished processing.');
    });
  });
};

exports.initiateUpload = async body => {
  const payload = { ...body, fileName: removeSpaces(body.fileName) };
  try {
    const uploadId = await getCreateMultipartUploadId(payload);
    if (uploadId) {
      return [
        StatusCodes.CREATED,
        { message: 'Upload Id created with success', uploadId }
      ];
    } else {
      return badRequest('Unable to create upload Id for multipart upload.');
    }
  } catch (err) {
    logger.error(
      `Error creating upload Id for multipart upload for file: ${payload.fileName}: `,
      err
    );
    return internalServerErrorRequest(
      'Error creating upload Id for multipart upload'
    );
  }
};

exports.uploadVideo = async archive => {
  try {
    const {
      title,
      description,
      videoPath,
      videoType,
      videoSize,
      thumbnailPath,
      thumbnailType,
      thumbnailSize,
      key,
      categories,
      isAvailableForSale
    } = archive;
    if (!title) {
      return badRequest('Must have file title associated with file upload.');
    }
    if (!description) {
      return badRequest(
        'Must have file description associated with file upload.'
      );
    }
    if (!categories) {
      return badRequest('Video categories must be provided.');
    }

    if (categories && typeof categories !== 'string') {
      return badRequest(
        'Video categories if provided must be a comma seperated string.'
      );
    }

    if (!videoPath) {
      return badRequest('Video must be provided to upload.');
    }
    if (videoPath && videoType !== VIDEO_MIME_TYPE) {
      return badRequest('Video must be a file with a mp4 extention.');
    }
    if (videoPath && videoSize < 0) {
      return badRequest('Video must be a file with actual content inside.');
    }

    if (!thumbnailPath) {
      return badRequest('Thumbnail must be provided to upload.');
    }
    if (thumbnailPath && thumbnailType !== THUMBNAIL_MIME_TYPE) {
      return badRequest(
        'Thumbnail must be a file with a image type extention like .jpg or .jpeg.'
      );
    }
    if (thumbnailPath && thumbnailSize <= 0) {
      return badRequest('Thumbnail must be a file with content inside.');
    }

    const video = await getVideoByTitle(title);

    if (video) {
      return badRequest(`Please provide another title for the video.`);
    } else {
      const isVideoBucketAvaiable = await doesVideoS3BucketExist();
      const isThumbnailBucketAvaiable = await doesThumbnailS3BucketExist();
      if (!isVideoBucketAvaiable && !isThumbnailBucketAvaiable) {
        await createVideoS3Bucket();
        await createThumbnailS3Bucket();
      } else {
        const { thumbNailLocation, videoLocation, duration } =
          await uploadVideoArchiveToS3Location(archive);

        const body = {
          title,
          description,
          key,
          ...(categories && {
            categories: categories.split(',').map(item => item.trim())
          }),
          duration: fancyTimeFormat(duration),
          url: videoLocation,
          thumbnail: thumbNailLocation,
          isAvailableForSale
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
    }
  } catch (err) {
    logger.error(`Error uploading video to s3: `, err);
    return internalServerErrorRequest('Error uploading video to s3.');
  }
};

exports.completeUpload = async body => {
  const payload = { ...body, fileName: removeSpaces(body.fileName) };
  try {
    const completed = await completeMultipartUpload(payload);
    if (completed) {
      return [
        StatusCodes.OK,
        { message: 'Multipart Upload completed with success', completed }
      ];
    } else {
      return badRequest(
        `Unable to complete multipart upload for: ${payload.fileName} .`
      );
    }
  } catch (err) {
    logger.error(
      `Error completing multipart upload for file: ${payload.fileName}: `,
      err
    );
    await abortMultipartUpload(payload);
    return internalServerErrorRequest('Error completing multipart upload.');
  }
};

exports.createPresignedUrls = async fileName => {
  const key = removeSpaces(fileName);
  try {
    const thumbnailPresignedUrl = await createThumbnailPresignedUrl(key);
    const videoPresignedUrl = await createVideoPresignedUrl(key);
    if (thumbnailPresignedUrl && videoPresignedUrl) {
      return [
        StatusCodes.CREATED,
        {
          message: 'Presigned urls created for file upload to s3 with success',
          thumbnailPresignedUrl,
          videoPresignedUrl
        }
      ];
    } else {
      return badRequest('Unable to create presigned urls for file upload.');
    }
  } catch (err) {
    logger.error(`Error creating presigned urls for file upload: `, err);
    return internalServerErrorRequest(
      'Error creating presigned urls for file upload.'
    );
  }
};

exports.createVideoMetadata = async upload => {
  try {
    const { title, description, categories, duration, isAvailableForSale } =
      upload;

    const key = removeSpaces(title);

    const body = {
      title,
      description,
      key,
      ...(categories && {
        categories: categories.split(',').map(item => item.trim())
      }),
      duration,
      url: getVideoDistributionURI(key),
      thumbnail: getThumbnailDistributionURI(key),
      isAvailableForSale
    };

    const video = await createVideo(body);
    if (video) {
      return [
        StatusCodes.CREATED,
        {
          message: 'Metadata for manual upload created to s3 with success',
          video
        }
      ];
    } else {
      return badRequest('Unable to save metadata for manual update.');
    }
  } catch (err) {
    logger.error(`Error manually uploading video to s3: `, err);
    return internalServerErrorRequest('Error manually uploading video to s3.');
  }
};

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
    const video = await getVideoById(videoId);
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

exports.updateVideo = async archive => {
  try {
    const {
      videoId,
      title,
      description,
      videoPath,
      videoType,
      videoSize,
      thumbnailPath,
      thumbnailType,
      thumbnailSize,
      categories,
      status,
      isAvailableForSale
    } = archive;
    if (!videoId) {
      return badRequest('Video identifier must be provided.');
    }
    if (isAvailableForSale && typeof isAvailableForSale !== 'boolean') {
      return badRequest('isAvailableForSale flag must be a boolean.');
    }
    if (categories && typeof categories !== 'string') {
      return badRequest(
        'Video categories if provided must be a comma sperated string.'
      );
    }
    const video = await getVideoById(videoId);

    if (video) {
      const newKey = removeSpaces(title);
      if (newKey !== video.key) {
        await copyVideoObject(video.key, newKey);
        await copyThumbnailObject(video.key, newKey);
        const body = {
          title,
          videoId,
          description,
          key: newKey,
          ...(categories && {
            categories: categories.split(',').map(item => item.trim())
          }),
          url: getVideoDistributionURI(newKey),
          thumbnail: getThumbnailDistributionURI(newKey),
          status,
          isAvailableForSale
        };
        await updateVideo(body);
        deleteVideoByKey(video.key);
        deleteThumbnailByKey(video.key);
        return [
          StatusCodes.OK,
          {
            message: 'Video updated to s3 with success',
            video: {
              ...body
            }
          }
        ];
      }
      if (videoPath && videoSize > 0) {
        if (videoType !== VIDEO_MIME_TYPE) {
          return badRequest('File must be a file with a mp4 extention.');
        }
        const isVideoBucketAvaiable = await doesVideoS3BucketExist();
        if (isVideoBucketAvaiable) {
          const s3Object = await doesVideoObjectExist(newKey);
          if (s3Object) {
            await deleteVideoByKey(newKey);
          }
          const { videoLocation, duration } =
            await uploadVideoArchiveToS3Location(archive);
          const body = {
            title,
            videoId,
            description,
            key: newKey,
            duration: fancyTimeFormat(duration),
            ...(categories && {
              categories: categories.split(',').map(item => item.trim())
            }),
            url: videoLocation,
            status,
            isAvailableForSale
          };
          await updateVideo(body);
          return [
            StatusCodes.OK,
            {
              message: 'Video updated and uploaded to s3 with success',
              video: {
                ...body
              }
            }
          ];
        }
      } else if (thumbnailPath && thumbnailSize > 0) {
        if (thumbnailType !== THUMBNAIL_MIME_TYPE) {
          return badRequest('File must be a file with a jpeg extention.');
        }
        const isThumbnailBucketAvaiable = await doesThumbnailS3BucketExist();
        if (isThumbnailBucketAvaiable) {
          const s3Object = await doesThumbnailObjectExist(newKey);
          if (s3Object) {
            await deleteThumbnailByKey(newKey);
          }
          const { thumbNailLocation } = await uploadVideoArchiveToS3Location(
            archive
          );
          const body = {
            title,
            videoId,
            description,
            key: newKey,
            ...(categories && {
              categories: categories.split(',').map(item => item.trim())
            }),
            thumbnail: thumbNailLocation,
            status,
            isAvailableForSale
          };
          await updateVideo(body);
          return [
            StatusCodes.OK,
            {
              message:
                'Video thumbnail updated and uploaded to s3 with success',
              video: {
                ...body
              }
            }
          ];
        }
      } else {
        const body = {
          title,
          videoId,
          description,
          key: newKey,
          ...(categories && {
            categories: categories.split(',').map(item => item.trim())
          }),
          url: getVideoDistributionURI(newKey),
          thumbnail: getThumbnailDistributionURI(newKey),
          status,
          isAvailableForSale
        };
        await updateVideo(body);
        return [
          StatusCodes.OK,
          {
            message: 'Video updated with success.',
            video: {
              ...body
            }
          }
        ];
      }
    } else {
      return badRequest(`No video was found to update by videoId provided.`);
    }
  } catch (err) {
    logger.error(`Error updating video metadata: `, err);
    return internalServerErrorRequest('Error updating video metadata.');
  }
};

exports.deleteVideoById = async videoId => {
  try {
    const video = await getVideoById(videoId);
    if (video) {
      const { key } = video;
      deleteVideoByKey(key);
      deleteThumbnailByKey(key);
      const [error, deletedVideo] = await deleteVideoById(videoId);
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
