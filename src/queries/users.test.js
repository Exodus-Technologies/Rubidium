import models from '../models';
import {
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateLastLogin,
  updateUser
} from './users';

jest.mock('../models');

describe('users queries', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getUsers returns paginated tuple', async () => {
    const users = [{ userId: 'u1' }];
    const chain = {
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(users)
    };
    const MockCtor = function () {};
    MockCtor.find = jest.fn().mockReturnValue(chain);
    MockCtor.find
      .mockImplementationOnce(() => chain)
      .mockImplementationOnce(() => ({
        count: jest.fn().mockResolvedValue(1)
      }));
    models.User = MockCtor;
    const r = await getUsers({ page: 1, limit: 10 });
    expect(r[0]).toBeNull();
    expect(Array.isArray(r[1])).toBe(true);
  });

  test('getUserById returns tuple when found', async () => {
    const MockCtor = function () {};
    MockCtor.findOne = jest.fn().mockResolvedValue({ userId: 'u1' });
    models.User = MockCtor;
    const r = await getUserById('u1');
    expect(r[0]).toBeNull();
    expect(r[1].userId).toBe('u1');
  });

  test('createUser returns created tuple', async () => {
    const mockFindOne = jest.fn().mockResolvedValue(null);
    const MockCtor = function (body) {
      return { save: jest.fn().mockResolvedValue(body) };
    };
    MockCtor.findOne = mockFindOne;
    models.User = MockCtor;
    const r = await createUser({ email: 'a@b.com', isAdmin: 'false' });
    expect(r[0]).toBeNull();
  });

  test('updateUser returns updated tuple', async () => {
    const mockFindOne = jest.fn().mockResolvedValue(null);
    const mockFindOneAndUpdate = jest.fn().mockResolvedValue({
      email: 'a@b',
      fullName: 'F',
      city: 'C',
      state: 'S',
      isAdmin: false
    });
    const MockCtor = function () {};
    MockCtor.findOne = mockFindOne;
    MockCtor.findOneAndUpdate = mockFindOneAndUpdate;
    models.User = MockCtor;
    const r = await updateUser('u1', { email: 'new@b.com' });
    expect(r[0]).toBeNull();
    expect(r[1].email).toBe('a@b');
  });

  test('updateLastLogin and deleteUserById return tuples', async () => {
    const mockFindOneAndUpdate = jest.fn().mockResolvedValue({ userId: 'u1' });
    const mockDeleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
    const MockCtor = function () {};
    MockCtor.findOneAndUpdate = mockFindOneAndUpdate;
    MockCtor.deleteOne = mockDeleteOne;
    models.User = MockCtor;
    const lr = await updateLastLogin('u1');
    expect(lr[0]).toBeNull();
    const dr = await deleteUserById('u1');
    expect(dr[0]).toBeNull();
  });
});
