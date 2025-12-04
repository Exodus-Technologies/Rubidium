import models from '../models';
import {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory
} from './categories';

jest.mock('../models');

describe('categories queries', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getCategories returns list', async () => {
    const chain = {
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(['c'])
    };
    const MockCtor = function () {};
    MockCtor.find = jest.fn().mockReturnValue(chain);
    models.Category = MockCtor;
    const res = await getCategories({ page: 1, limit: 10 });
    expect(res).toEqual(['c']);
  });

  test('getCategoryById and getCategoryByName', async () => {
    const mockFindOne = jest.fn();
    mockFindOne.mockResolvedValueOnce({ categoryId: 'cat1' });
    mockFindOne.mockResolvedValueOnce({ name: 'N1' });
    const MockCtor = function () {};
    MockCtor.findOne = mockFindOne;
    models.Category = MockCtor;
    const a = await getCategoryById('cat1');
    expect(a.categoryId).toBe('cat1');
    const b = await getCategoryByName('N1');
    expect(b.name).toBe('N1');
  });

  test('createCategory rejects when exists and creates when not', async () => {
    const mockFindOne = jest.fn();
    mockFindOne.mockResolvedValueOnce({ name: 'n' });
    const MockCtor = function () {};
    MockCtor.findOne = mockFindOne;
    models.Category = MockCtor;
    const r1 = await createCategory({ name: 'n' });
    expect(r1[0]).toBeInstanceOf(Error);

    mockFindOne.mockResolvedValueOnce(null);
    models.Category = function (body) {
      return {
        save: jest.fn().mockResolvedValue({ ...body, categoryId: 'c1' })
      };
    };
    // re-attach static findOne so the implementation can call Category.findOne
    models.Category.findOne = mockFindOne;
    const r2 = await createCategory({ name: 'n2', description: 'd' });
    expect(r2[0]).toBeNull();
    expect(r2[1].categoryId).toBe('c1');
  });

  test('updateCategory returns updated tuple', async () => {
    const mockFindOneAndUpdate = jest.fn().mockResolvedValue({ name: 'up' });
    const MockCtor = function () {};
    MockCtor.findOneAndUpdate = mockFindOneAndUpdate;
    models.Category = MockCtor;
    const r = await updateCategory('c1', { name: 'up' });
    expect(r).toEqual([null, { name: 'up' }]);
  });
});
