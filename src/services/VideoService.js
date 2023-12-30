'use strict';

import { StatusCodes } from 'http-status-codes';
import formidable from 'formidable';
import {
  uploadVideoArchiveToS3Location,
  doesVideoS3BucketExist,
  doesThumbnailS3BucketExist,
  doesVideoObjectExist,
  deleteVideoByKey,
  copyVideoObject,
  copyThumbnailObject,
  getVideoDistributionURI,
  deleteThumbnailByKey,
  createVideoS3Bucket,
  createThumbnailS3Bucket,
  getThumbnailDistributionURI,
  doesThumbnailObjectExist
} from '../aws';
import {
  VIDEO_MIME_TYPE,
  THUMBNAIL_MIME_TYPE,
  MAX_FILE_SIZE_VIDEO
} from '../constants';
import {
  createVideo,
  updateVideoViews,
  getVideoById,
  getVideoByTitle,
  updateVideo,
  deleteVideoById,
  getVideos,
  getTotal
} from '../queries/videos';
import { internalServerErrorRequest, badRequest } from '../response-codes';
import { fancyTimeFormat } from '../utilities/time';
import { stringToBoolean } from '../utilities/boolean';
import { isEmpty } from '../utilities/objects';
import { removeSpaces } from '../utilities/strings';

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
      console.log('Error on form parse: ', err);
    });
    form.on('end', () => {
      console.log('Form is finished processing.');
    });
  });
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
    console.log(`Error uploading video to s3: `, err);
    return internalServerErrorRequest('Error uploading video to s3.');
  }
};

exports.manualUpload = async upload => {
  try {
    const { title, description, categories, duration, isAvailableForSale } =
      upload;

    const key = removeSpaces(title);

    const s3VideoObject = await doesVideoObjectExist(key);
    if (!s3VideoObject) {
      return badRequest('Video file is not in s3 bucket. Try again later.');
    }

    const s3ThumbNailObject = await doesThumbnailObjectExist(key);
    if (!s3ThumbNailObject) {
      return badRequest('Thumbnail file is not in s3 bucket. Try again later.');
    }

    const body = {
      title,
      description,
      key: removeSpaces(title),
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
        StatusCodes.OK,
        { message: 'Video manual uploaded to s3 with success', video }
      ];
    } else {
      return badRequest('Unable to save manual upload video with metadata.');
    }
  } catch (err) {
    console.log(`Error manually uploading video to s3: `, err);
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
    console.log('Error getting all videos: ', err);
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
    console.log('Error getting video by id ', err);
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
    console.log('Error updating views on video: ', err);
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
    console.log(`Error updating video metadata: `, err);
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
      const deletedVideo = await deleteVideoById(videoId);
      if (deletedVideo) {
        return [StatusCodes.NO_CONTENT];
      }
    }
    return badRequest(`No video found with id provided.`);
  } catch (err) {
    console.log('Error deleting video by id: ', err);
    return internalServerErrorRequest('Error deleting video by id.');
  }
};

exports.getTotal = async query => {
  try {
    const total = await getTotal(query);
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
    console.log('Error getting total for all videos: ', err);
    return internalServerErrorRequest('Error getting total for all videos.');
  }
};
