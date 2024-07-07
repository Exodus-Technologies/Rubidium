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
import {
  getCoverImageDistributionURI,
  getIssueDistributionURI
} from '../aws/cloudFront';
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
  s3SecretAccessKey,
  s3VideoBucketName,
  s3ThumbnailBucketName,
  s3IssueBucketName,
  s3CoverImageBucketName
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

export const getVideoObjectKey = key => {
  return `${key}.${DEFAULT_VIDEO_FILE_EXTENTION}`;
};

export const getThumbnailObjectKey = key => {
  return `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`;
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

/**
 * Issue helper functions
 */
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

export const getIssueObjectKey = key => {
  return `${key}.${DEFAULT_PDF_FILE_EXTENTION}`;
};

export const getCoverImageObjectKey = key => {
  return `${key}.${DEFAULT_COVERIMAGE_FILE_EXTENTION}`;
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
      await s3Client.send(new HeadObjectCommand(getS3IssueParams(key)));
      resolve(true);
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesIssueObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(false);
    }
  });
};

export const doesCoverImageObjectExist = key => {
  return new Promise(async (resolve, reject) => {
    try {
      await s3Client.send(new HeadObjectCommand(getS3CoverImageParams(key)));
      resolve(true);
    } catch (err) {
      logger.error(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      logger.error({
        message: 'doesCoverImageObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(false);
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
