import models from '../models';
import {
  createVideo,
  deleteVideo,
  getTotal,
  getVideos,
  updateVideoViews
} from './videos';

jest.mock('../models');

describe('videos queries', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getVideos returns paginated mapped list', async () => {
    const videos = [{ videoId: 'v1' }];
    const chain = {
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(videos)
    };
    const MockCtor = function () {};
    MockCtor.find = jest.fn().mockReturnValue(chain);
    MockCtor.find
      .mockImplementationOnce(() => chain)
      .mockImplementationOnce(() => ({
        count: jest.fn().mockResolvedValue(1)
      }));
    models.Video = MockCtor;
    const res = await getVideos({ page: 1, limit: 10 });
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].total).toBeDefined();
  });

  test('getTotal returns number', async () => {
    const MockCtor = function () {};
    MockCtor.count = jest.fn().mockResolvedValue(7);
    models.Video = MockCtor;
    const t = await getTotal();
    expect(t).toBe(7);
  });

  test('createVideo returns created object', async () => {
    const save = jest.fn().mockResolvedValue({ videoId: 'v1', title: 'T' });
    models.Video = function (body) {
      return { save };
    };
    const created = await createVideo({ title: 'T' });
    expect(created.videoId).toBe('v1');
  });

  test('updateVideoViews calls findOneAndUpdate and deleteVideo returns tuple', async () => {
    const mockFindOneAndUpdate = jest
      .fn()
      .mockResolvedValue({ videoId: 'v1', videoViews: 1 });
    const mockDeleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
    const MockCtor = function () {};
    MockCtor.findOneAndUpdate = mockFindOneAndUpdate;
    MockCtor.deleteOne = mockDeleteOne;
    models.Video = MockCtor;
    const v = await updateVideoViews('v1');
    expect(mockFindOneAndUpdate).toHaveBeenCalled();
    const d = await deleteVideo('v1');
    expect(d[0]).toBeNull();
  });
});
