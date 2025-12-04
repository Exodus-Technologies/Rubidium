import models from '../models';
import { getCache, setCache } from './cache';

jest.mock('../models');

describe('cache queries', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getCache returns body when found', async () => {
    const MockCtor = function () {};
    MockCtor.findOne = jest
      .fn()
      .mockResolvedValue({ key: 'k', body: { a: 1 } });
    models.Cache = MockCtor;
    const res = await getCache('k');
    expect(res).toEqual({ a: 1 });
  });

  test('getCache returns null when not found', async () => {
    const MockCtor = function () {};
    MockCtor.findOne = jest.fn().mockResolvedValue(null);
    models.Cache = MockCtor;
    const res = await getCache('missing');
    expect(res).toBeNull();
  });

  test('setCache saves and returns payload', async () => {
    const save = jest.fn().mockResolvedValue({ key: 'k', body: { b: 2 } });
    const MockCtor = function (body) {
      return { save };
    };
    models.Cache = MockCtor;
    const payload = { key: 'k', body: { b: 2 } };
    const res = await setCache(payload);
    expect(res).toEqual(payload);
    expect(save).toHaveBeenCalled();
  });
});
