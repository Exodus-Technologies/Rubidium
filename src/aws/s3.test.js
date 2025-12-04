var mockSend;

jest.mock('../config', () => ({
  sources: {
    aws: {
      region: 'us-east-1',
      signatureVersion: 'v4',
      s3: {
        s3AccessKeyId: 'AKIA',
        s3SecretAccessKey: 'SECRET',
        s3VideoBucketName: 'video-bucket',
        s3ThumbnailBucketName: 'thumb-bucket',
        s3IssueBucketName: 'issue-bucket',
        s3CoverImageBucketName: 'cover-bucket'
      }
    }
  }
}));

jest.mock('../logger', () => ({
  error: jest.fn(),
  info: jest.fn()
}));

jest.mock('@aws-sdk/client-s3', () => {
  mockSend = jest.fn();
  return {
    S3Client: jest.fn(() => ({ send: mockSend })),
    CopyObjectCommand: jest.fn(p => ({ type: 'copy', p })),
    CreateBucketCommand: jest.fn(p => ({ type: 'create', p })),
    DeleteObjectCommand: jest.fn(p => ({ type: 'delete', p })),
    HeadObjectCommand: jest.fn(p => ({ type: 'head', p })),
    ListBucketsCommand: jest.fn(p => ({ type: 'list', p }))
  };
});

jest.mock('../aws/cloudFront', () => ({
  getCoverImageDistributionURI: jest.fn(),
  getIssueDistributionURI: jest.fn()
}));

import {
  copyIssueObject,
  copyThumbnailObject,
  copyVideoObject,
  createIssueS3Bucket,
  deleteIssueByKey,
  deleteThumbnailByKey,
  deleteVideoByKey,
  doesCoverImageS3BucketExist,
  doesIssueObjectExist,
  doesIssueS3BucketExist,
  getCoverImageObjectKey,
  getIssueObjectKey,
  getThumbnailObjectKey,
  getVideoObjectKey
} from './s3';

describe('s3 helpers', () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  test('object key builders append extensions', () => {
    expect(getVideoObjectKey('k')).toMatch(/k\./);
    expect(getThumbnailObjectKey('t')).toMatch(/t\./);
    expect(getIssueObjectKey('i')).toMatch(/i\./);
    expect(getCoverImageObjectKey('c')).toMatch(/c\./);
  });

  test('copyVideoObject resolves when send succeeds', async () => {
    mockSend.mockResolvedValueOnce({});
    await expect(copyVideoObject('a', 'b')).resolves.toBeUndefined();
    expect(mockSend).toHaveBeenCalled();
  });

  test('copyThumbnailObject resolves when send succeeds', async () => {
    mockSend.mockResolvedValueOnce({});
    await expect(copyThumbnailObject('a', 'b')).resolves.toBeUndefined();
  });

  test('deleteVideoByKey and deleteThumbnailByKey resolve on success', async () => {
    mockSend.mockResolvedValue({});
    await expect(deleteVideoByKey('k')).resolves.toBeUndefined();
    await expect(deleteThumbnailByKey('k')).resolves.toBeUndefined();
  });

  test('createIssueS3Bucket resolves on success', async () => {
    mockSend.mockResolvedValueOnce({});
    await expect(createIssueS3Bucket()).resolves.toBeUndefined();
  });

  test('doesIssueS3BucketExist returns true when bucket present', async () => {
    mockSend.mockResolvedValueOnce({ Buckets: [{ Name: 'issue-bucket' }] });
    const exists = await doesIssueS3BucketExist();
    expect(exists).toBe(true);
  });

  test('doesCoverImageS3BucketExist returns false when not present', async () => {
    mockSend.mockResolvedValueOnce({ Buckets: [{ Name: 'other' }] });
    const exists = await doesCoverImageS3BucketExist();
    expect(exists).toBe(false);
  });

  test('doesIssueObjectExist resolves true on head success and rejects false on error', async () => {
    mockSend.mockResolvedValueOnce({});
    await expect(doesIssueObjectExist('k')).resolves.toBe(true);
    mockSend.mockRejectedValueOnce({ $metadata: {} });
    await expect(doesIssueObjectExist('k')).rejects.toBe(false);
  });

  test('copyIssueObject and deleteIssueByKey call s3 client', async () => {
    mockSend.mockResolvedValue({});
    await expect(copyIssueObject('x', 'y')).resolves.toBeUndefined();
    await expect(deleteIssueByKey('x')).resolves.toBeUndefined();
  });
});
