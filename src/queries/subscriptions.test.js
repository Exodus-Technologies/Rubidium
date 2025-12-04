import models from '../models';
import {
  createSubscription,
  deleteSubscription,
  deleteSubscriptions,
  getSubscriptions,
  getUserSubscriptions,
  updateSubscription
} from './subscriptions';

jest.mock('../models');

describe('subscriptions queries', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getSubscriptions returns list', async () => {
    const chain = {
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(['s'])
    };
    const MockCtor = function () {};
    MockCtor.find = jest.fn().mockReturnValue(chain);
    models.Subscription = MockCtor;
    const res = await getSubscriptions({ page: 1, limit: 10 });
    expect(res).toEqual(['s']);
  });

  test('getUserSubscriptions returns subscriptions for user', async () => {
    const MockCtor = function () {};
    MockCtor.find = jest.fn().mockResolvedValue([{ subscriptionId: 's1' }]);
    models.Subscription = MockCtor;
    const r = await getUserSubscriptions('u1');
    expect(r[0].subscriptionId).toBe('s1');
  });

  test('createSubscription for video type returns created tuple', async () => {
    const save = jest.fn().mockResolvedValue({ access: 'MONTH' });
    models.Subscription = function (body) {
      return { save };
    };
    const [err, res] = await createSubscription({
      type: 'video',
      product: 'MONTH'
    });
    expect(err).toBeNull();
    expect(res.access).toBe('MONTH');
  });

  test('updateSubscription updates and returns tuple', async () => {
    const mockFindOne = jest.fn().mockResolvedValue({ ids: ['a'] });
    const mockFindOneAndUpdate = jest
      .fn()
      .mockResolvedValue({ ids: ['a', 'b'], left: 4 });
    const MockCtor = function () {};
    MockCtor.findOne = mockFindOne;
    MockCtor.findOneAndUpdate = mockFindOneAndUpdate;
    models.Subscription = MockCtor;
    const r = await updateSubscription('sub1', { id: 'b' });
    expect(r[0]).toBeNull();
    expect(r[1].ids.length).toBe(2);
  });

  test('deleteSubscription and deleteSubscriptions return tuples', async () => {
    const mockDeleteOne = jest.fn().mockResolvedValueOnce({ deletedCount: 1 });
    const mockDeleteMany = jest.fn().mockResolvedValueOnce({ deletedCount: 1 });
    const MockCtor = function () {};
    MockCtor.deleteOne = mockDeleteOne;
    MockCtor.deleteMany = mockDeleteMany;
    models.Subscription = MockCtor;
    const r1 = await deleteSubscription('s1');
    expect(r1[0]).toBeNull();
    const r2 = await deleteSubscriptions('e@x.com');
    expect(r2[0]).toBeNull();
  });
});
