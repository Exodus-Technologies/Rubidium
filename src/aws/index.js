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
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
const { region, signatureVersion, s3 } = aws;
const {
  s3AccessKeyId,
  expiresIn,
  s3SecretAccessKey,
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
  region,
  signatureVersion,
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey
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

const getS3VideoParams = (key = '') => {
  const params = {
    Bucket: s3VideoBucketName
  };
  if (key) {
    params.Key = getVideoObjectKey(key);
  }
  return params;
};

const getS3ThumbnailParams = (key = '') => {
  const params = {
    Bucket: s3ThumbnailBucketName
  };
  if (key) {
    params.Key = getThumbnailObjectKey(key);
  }
  return params;
};

export const createVideoPresignedUrl = key => {
  return getSignedUrl(
    s3Client,
    new PutObjectCommand({
      ...getS3VideoParams(key),
      ContentType: 'video/mp4'
    }),
    {
      expiresIn
    }
  );
};

export const createThumbnailPresignedUrl = key => {
  return getSignedUrl(
    s3Client,
    new PutObjectCommand(getS3ThumbnailParams(key)),
    { expiresIn }
  );
};

export const createVideoS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await s3Client.send(new CreateBucketCommand(getS3VideoParams()));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'createVideoS3Bucket',
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
      await s3Client.send(new CreateBucketCommand(getS3ThumbnailParams()));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'createThumbnailS3Bucket',
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
      logger.error(err);
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
      logger.error(err);
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
      const s3Object = await s3Client.send(
        new HeadObjectCommand(getS3VideoParams(key))
      );
      resolve(s3Object);
    } catch (err) {
      logger.error(err);
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
      const s3Object = await s3Client.send(
        new HeadObjectCommand(getS3ThumbnailParams(key))
      );
      resolve(s3Object);
    } catch (err) {
      logger.error(err);
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
        ...getS3VideoParams(newKey),
        CopySource: `${s3VideoBucketName}/${getVideoObjectKey(oldKey)}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
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
        ...getS3CoverImageParams(newKey),
        CopySource: `${s3ThumbnailBucketName}/${getThumbnailObjectKey(oldKey)}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
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
      s3Client.send(new DeleteObjectCommand(getS3VideoParams(key)));
      resolve();
    } catch (err) {
      logger.error(err);
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
      s3Client.send(new DeleteObjectCommand(getS3ThumbnailParams(key)));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'deleteThumbnailByKey',
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
        ...getS3VideoParams(key),
        Body: passThrough
      };

      // Upload the file to S3
      const upload = new Upload({
        client: s3Client,
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB (5MB)
        queueSize: 10, // optional concurrency configuration
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
      ...getS3ThumbnailParams(key),
      Body: buffer
    };

    try {
      // Upload the file to S3
      await s3Client.send(new PutObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'uploadThumbnailToS3',
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

const getS3IssueParams = (key = '') => {
  const params = {
    Bucket: s3IssueBucketName
  };
  if (key) {
    params.Key = getIssueObjectKey(key);
  }
  return params;
};

const getS3CoverImageParams = (key = '') => {
  const params = {
    Bucket: s3CoverImageBucketName
  };
  if (key) {
    params.Key = getCoverImageObjectKey(key);
  }
  return params;
};

export const createIssueS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await s3Client.send(new CreateBucketCommand(getS3IssueParams()));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'createIssueS3Bucket',
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
      await s3Client.send(new CreateBucketCommand(getS3CoverImageParams()));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'createCoverImageS3Bucket',
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
      logger.error(err);
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
      logger.error(err);
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
      const s3Object = await s3Client.send(
        new HeadObjectCommand(getS3IssueParams(key))
      );
      resolve(s3Object);
    } catch (err) {
      logger.error(err);
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
      const s3Object = await s3Client.send(
        new HeadObjectCommand(getS3CoverImageParams(key))
      );
      resolve(s3Object);
    } catch (err) {
      logger.error(err);
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
        ...getS3IssueParams(newKey),
        CopySource: `${s3IssueBucketName}/${getIssueObjectKey(oldKey)}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyIssueObject',
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
        ...getS3CoverImageParams(newKey),
        CopySource: `${s3IssueBucketName}/${getCoverImageObjectKey(oldKey)}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'copyCoverImageObject',
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
      await s3Client.send(new DeleteObjectCommand(getS3IssueParams(key)));
      resolve();
    } catch (err) {
      logger.error(err);
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
      await s3Client.send(new DeleteObjectCommand(getS3CoverImageParams(key)));
      resolve();
    } catch (err) {
      logger.error(err);
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
      ...getS3IssueParams(key),
      Body: fileContent
    };
    try {
      await s3Client.send(new PutObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'uploadIssueToS3',
        requestId,
        cfId,
        extendedRequestId
      });
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
      ...getS3CoverImageParams(key),
      Body: fileContent
    };
    try {
      await s3Client.send(new PutObjectCommand(params));
      resolve();
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'uploadCoverImageToS3',
        requestId,
        cfId,
        extendedRequestId
      });
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
