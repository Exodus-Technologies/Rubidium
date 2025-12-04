jest.mock('../aws/s3', () => ({
  getVideoObjectKey: jest.fn(k => `${k}.vid`),
  getThumbnailObjectKey: jest.fn(k => `${k}.thumb`),
  getIssueObjectKey: jest.fn(k => `${k}.issue`),
  getCoverImageObjectKey: jest.fn(k => `${k}.cover`)
}));

jest.mock('../config', () => ({
  sources: {
    aws: {
      cloudFront: {
        videoDistributionURI: 'https://video.cdn',
        thumbnailDistributionURI: 'https://thumb.cdn',
        issueDistributionURI: 'https://issue.cdn',
        coverImageDistributionURI: 'https://cover.cdn'
      }
    }
  }
}));

import {
  getCoverImageDistributionURI,
  getIssueDistributionURI,
  getThumbnailDistributionURI,
  getVideoDistributionURI
} from './cloudFront';

describe('cloudFront helpers', () => {
  test('distribution URI builders append object keys', () => {
    expect(getVideoDistributionURI('k1')).toBe('https://video.cdn/k1.vid');
    expect(getThumbnailDistributionURI('t1')).toBe(
      'https://thumb.cdn/t1.thumb'
    );
    expect(getIssueDistributionURI('i1')).toBe('https://issue.cdn/i1.issue');
    expect(getCoverImageDistributionURI('c1')).toBe(
      'https://cover.cdn/c1.cover'
    );
  });
});
