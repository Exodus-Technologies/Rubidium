import models from '../models';
import {
  createIssue,
  getIssues,
  getNextIssueOrder,
  getTotal,
  updateIssueViews
} from './issues';

jest.mock('../models');

describe('issues queries', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getIssues returns mapped list with total/pages', async () => {
    const issues = [{ issueId: 'i1' }];
    const chain = {
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(issues)
    };
    const MockCtor = function () {};
    MockCtor.find = jest
      .fn()
      .mockReturnValueOnce(chain)
      .mockReturnValueOnce({ count: jest.fn().mockResolvedValue(1) });
    // For count, ensure .count() resolves
    MockCtor.find
      .mockImplementationOnce(() => chain)
      .mockImplementationOnce(() => ({
        count: jest.fn().mockResolvedValue(1)
      }));
    models.Issue = MockCtor;
    const res = await getIssues({ page: 1, limit: 10 });
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].total).toBeDefined();
  });

  test('getTotal returns number', async () => {
    const MockCtor = function () {};
    MockCtor.count = jest.fn().mockResolvedValue(5);
    models.Issue = MockCtor;
    const t = await getTotal();
    expect(t).toBe(5);
  });

  test('createIssue returns created fields', async () => {
    const save = jest.fn().mockResolvedValue({
      title: 'T',
      url: 'u',
      description: 'd',
      totalViews: 0,
      author: 'a',
      issueId: 'i1'
    });
    models.Issue = function (body) {
      return { save };
    };
    const created = await createIssue({ title: 'T' });
    expect(created.title).toBe('T');
    expect(created.issueId).toBe('i1');
  });

  test('updateIssueViews calls findOneAndUpdate', async () => {
    const mockFindOneAndUpdate = jest
      .fn()
      .mockResolvedValue({ issueId: 'i1', totalViews: 1 });
    const MockCtor = function () {};
    MockCtor.findOneAndUpdate = mockFindOneAndUpdate;
    models.Issue = MockCtor;
    const r = await updateIssueViews('i1');
    expect(mockFindOneAndUpdate).toHaveBeenCalled();
  });

  test('getNextIssueOrder returns next order', async () => {
    const MockCtor = function () {};
    MockCtor.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([{ issueOrder: 2 }])
      })
    });
    models.Issue = MockCtor;
    const next = await getNextIssueOrder();
    expect(next).toBe(3);
  });
});
