'use strict';

import {
  getCoverImageObjectKey,
  getIssueObjectKey,
  getThumbnailObjectKey,
  getVideoObjectKey
} from '../aws/s3';
import config from '../config';

const { aws } = config.sources;
const { cloudFront } = aws;
const {
  videoDistributionURI,
  thumbnailDistributionURI,
  issueDistributionURI,
  coverImageDistributionURI
} = cloudFront;

export const getVideoDistributionURI = key => {
  return `${videoDistributionURI}/${getVideoObjectKey(key)}`;
};

export const getThumbnailDistributionURI = key => {
  return `${thumbnailDistributionURI}/${getThumbnailObjectKey(key)}`;
};

export const getIssueDistributionURI = key => {
  return `${issueDistributionURI}/${getIssueObjectKey(key)}`;
};

export const getCoverImageDistributionURI = key => {
  return `${coverImageDistributionURI}/${getCoverImageObjectKey(key)}`;
};
