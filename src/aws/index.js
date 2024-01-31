'use strict';

import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream } from 'fs';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { PassThrough } from 'stream';
import config from '../config';
import {
  DEFAULT_COVERIMAGE_FILE_EXTENTION,
  DEFAULT_PDF_FILE_EXTENTION,
  DEFAULT_THUMBNAIL_FILE_EXTENTION,
  DEFAULT_VIDEO_FILE_EXTENTION
} from '../constants';
import logger from '../logger';
import { getFileContentFromPath } from '../utilities/files';

const { aws } = config.sources;
const { region, s3 } = aws;
const {
  s3AccessKeyId,
  s3AecretAccessKey,
  s3VideoBucketName,
  s3ThumbnailBucketName,
  s3IssueBucketName,
  s3CoverImageBucketName,
  videoDistributionURI,
  thumbnailDistributionURI,
  issueDistributionURI,
  coverImageDistributionURI
} = s3;

// Create S3 service object
const s3Client = new S3Client({
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3AecretAccessKey,
    region
  }
});

/**
 * Video helper functions
 */
const getVideoObjectKey = key => {
  return `${key}.${DEFAULT_VIDEO_FILE_EXTENTION}`;
};

const getThumbnailObjectKey = key => {
  return `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`;
};

export const createVideoS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName
      };
      await s3Client.send(new CreateBucketCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'createS3Bucket',
        requestId,
        cfId,
        bucketName: s3VideoBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const getVideoDistributionURI = key => {
  return `${videoDistributionURI}/${getVideoObjectKey(key)}`;
};

export const getThumbnailDistributionURI = key => {
  return `${thumbnailDistributionURI}/${getThumbnailObjectKey(key)}`;
};

export const createThumbnailS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3ThumbnailBucketName
      };
      await s3Client.send(new CreateBucketCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'createS3Bucket',
        requestId,
        cfId,
        bucketName: s3ThumbnailBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesVideoS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(bucket => bucket.Name === s3VideoBucketName);
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesVideoS3BucketExist',
        requestId,
        cfId,
        bucketName: s3IssueBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesThumbnailS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(
        bucket => bucket.Name === s3ThumbnailBucketName
      );
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesThumbnailS3BucketExist',
        requestId,
        cfId,
        bucketName: s3CoverImageBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesVideoObjectExist = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName,
        Key: getVideoObjectKey(key)
      };
      const s3Object = await s3Client.send(new HeadObjectCommand(params));
      resolve(s3Object);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesVideoObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesThumbnailObjectExist = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3ThumbnailBucketName,
        Key: getThumbnailObjectKey(key)
      };
      const s3Object = await s3Client.send(new HeadObjectCommand(params));
      resolve(s3Object);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesThumbnailObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const copyVideoObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName,
        CopySource: `${s3VideoBucketName}/${getVideoObjectKey(oldKey)}`,
        Key: getVideoObjectKey(newKey)
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyVideoObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const copyThumbnailObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3ThumbnailBucketName,
        CopySource: `${s3ThumbnailBucketName}/${getThumbnailObjectKey(oldKey)}`,
        Key: getThumbnailObjectKey(newKey)
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyThumbnailObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const deleteVideoByKey = key => {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName,
        Key: getVideoObjectKey(key)
      };
      s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteVideoByKey',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const deleteThumbnailByKey = key => {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: s3ThumbnailBucketName,
        Key: getThumbnailObjectKey(key)
      };
      s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteVideoByKey',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const uploadVideoToS3 = (filePath, key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileStream = createReadStream(filePath);

      // Create a PassThrough stream to pipe the file stream through
      const passThrough = new PassThrough();

      // Pipe the file stream through the PassThrough stream
      fileStream.pipe(passThrough);

      // Set up the parameters for the S3 upload
      const params = {
        Bucket: s3VideoBucketName,
        Key: getVideoObjectKey(key),
        Body: passThrough
      };

      // Upload the file to S3
      const upload = new Upload({
        client: s3Client,
        partSize: 1024 * 1024 * 64, // optional size of each part, in bytes, at least 5MB (64MB)
        queueSize: 50, // optional concurrency configuration
        params
      });

      // Monitor the upload progress
      upload.on('httpUploadProgress', progress => {
        logger.info(`Progress on video upload: ${JSON.stringify(progress)}`);
      });

      // Handle the upload completion
      await upload.done();
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'uploadVideoToS3',
        requestId,
        cfId,
        extendedRequestId
      });
      logger.error(
        `Error uploading video file to s3 bucket: ${s3VideoBucketName} `,
        err
      );
      reject(err);
    }
  });
};

export const uploadThumbnailToS3 = (buffer, key) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket: s3ThumbnailBucketName,
      Key: getThumbnailObjectKey(key), // File name you want to save as in S3
      Body: buffer
    };

    try {
      // Upload the file to S3
      const upload = new Upload({
        client: s3Client,
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB (64MB)
        queueSize: 5, // optional concurrency configuration
        params
      });

      // Monitor the upload progress
      upload.on('httpUploadProgress', progress => {
        logger.info(`Progress on video upload: ${JSON.stringify(progress)}`);
      });

      // Handle the upload completion
      await upload.done();
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'uploadToS3',
        requestId,
        cfId,
        extendedRequestId
      });
      logger.error(
        `Error uploading thumbnail file to s3 bucket: ${s3VideoBucketName} `,
        err
      );
      reject(err);
    }
  });
};

export const uploadVideoArchiveToS3Location = async archive => {
  return new Promise(async (resolve, reject) => {
    try {
      const { videoPath, thumbnailPath, key } = archive;
      const duration = await getVideoDurationInSeconds(videoPath);
      const thumbnailFile = await getFileContentFromPath(thumbnailPath);
      await uploadVideoToS3(videoPath, key);
      await uploadThumbnailToS3(thumbnailFile, key);
      const videoLocation = getVideoDistributionURI(key);
      const thumbNailLocation = getThumbnailDistributionURI(key);
      resolve({ thumbNailLocation, videoLocation, duration });
    } catch (err) {
      logger.error(`Error uploading video and thumbnail to s3 buckets`, err);
      reject(err);
    }
  });
};

/**
 * Issue helper functions
 */
const getIssueObjectKey = key => {
  return `${key}.${DEFAULT_PDF_FILE_EXTENTION}`;
};

const getCoverImageObjectKey = key => {
  return `${key}.${DEFAULT_COVERIMAGE_FILE_EXTENTION}`;
};

export const createIssueS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName
      };
      await s3Client.send(new CreateBucketCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'createS3Bucket',
        requestId,
        cfId,
        bucketName: s3IssueBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const createCoverImageS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3CoverImageBucketName
      };
      await s3Client.send(new CreateBucketCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'createS3Bucket',
        requestId,
        cfId,
        bucketName: s3CoverImageBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesIssueS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(bucket => bucket.Name === s3IssueBucketName);
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesIssueS3BucketExist',
        requestId,
        cfId,
        bucketName: s3IssueBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesCoverImageS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(
        bucket => bucket.Name === s3CoverImageBucketName
      );
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesCoverImageS3BucketExist',
        requestId,
        cfId,
        bucketName: s3CoverImageBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesIssueObjectExist = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName,
        Key: getIssueObjectKey(key)
      };
      const s3Object = await s3Client.send(new HeadObjectCommand(params));
      resolve(s3Object);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesIssueObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesCoverImageObjectExist = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName,
        Key: getCoverImageObjectKey(key)
      };
      const s3Object = await s3Client.send(new HeadObjectCommand(params));
      resolve(s3Object);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesCoverImageObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const copyIssueObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName,
        CopySource: `${s3IssueBucketName}/${getIssueObjectKey(oldKey)}`,
        Key: getIssueObjectKey(newKey)
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyS3Object',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const copyCoverImageObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName,
        CopySource: `${s3IssueBucketName}/${getCoverImageObjectKey(oldKey)}`,
        Key: getCoverImageObjectKey(newKey)
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyS3Object',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const getIssueDistributionURI = key => {
  return `${issueDistributionURI}/${getIssueObjectKey(key)}`;
};

export const getCoverImageDistributionURI = key => {
  return `${coverImageDistributionURI}/${getCoverImageObjectKey(key)}`;
};

export const deleteIssueByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3IssueBucketName,
        Key: getIssueObjectKey(key)
      };
      await s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteIssueByKey',
        requestId,
        cfId,
        key,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const deleteCoverImageByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3CoverImageBucketName,
        Key: getCoverImageObjectKey(key)
      };
      await s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteCoverImageByKey',
        requestId,
        cfId,
        key,
        extendedRequestId
      });
      reject(err);
    }
  });
};

const uploadIssueToS3 = (fileContent, key) => {
  return new Promise(async (resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: s3IssueBucketName,
      Key: getIssueObjectKey(key), // File name you want to save as in S3
      Body: fileContent
    };
    try {
      await s3Client.send(new PutObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(
        `Error uploading file to s3 bucket: ${s3IssueBucketName} `,
        err
      );
      reject(err);
    }
  });
};

const uploadCoverImageToS3 = (fileContent, key) => {
  return new Promise(async (resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: s3CoverImageBucketName,
      Key: getCoverImageObjectKey(key), // File name you want to save as in S3
      Body: fileContent
    };
    try {
      await s3Client.send(new PutObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(
        `Error uploading file to s3 bucket: ${s3CoverImageBucketName} `,
        err
      );
      reject(err);
    }
  });
};

export const uploadPdfArchiveToS3Location = async archive => {
  return new Promise(async (resolve, reject) => {
    try {
      const { key, issuePath, coverImagePath } = archive;
      const issueFile = await getFileContentFromPath(issuePath);
      const coverImageFile = await getFileContentFromPath(coverImagePath);
      await uploadIssueToS3(issueFile, key);
      await uploadCoverImageToS3(coverImageFile, key);
      const issueLocation = getIssueDistributionURI(key);
      const coverImageLocation = getCoverImageDistributionURI(key);
      resolve({ issueLocation, coverImageLocation });
    } catch (err) {
      logger.error(`Error uploading pdf and content to s3 bucket:`, err);
      reject(err);
    }
  });
};
