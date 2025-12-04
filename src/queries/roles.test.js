import models from '../models';
import {
  createRole,
  deleteRole,
  getRoleById,
  getRoleByName,
  getRoles,
  updateRole
} from './roles';

jest.mock('../models');

describe('roles queries', () => {
  let mockFind;
  let mockFindOne;
  let mockFindOneAndUpdate;
  let mockDeleteOne;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFind = jest.fn();
    mockFindOne = jest.fn();
    mockFindOneAndUpdate = jest.fn();
    mockDeleteOne = jest.fn();

    const MockCtor = function (body) {
      return { save: jest.fn().mockResolvedValue({ ...body, roleId: 'r1' }) };
    };
    MockCtor.find = mockFind;
    MockCtor.findOne = mockFindOne;
    MockCtor.findOneAndUpdate = mockFindOneAndUpdate;
    MockCtor.deleteOne = mockDeleteOne;
    models.Role = MockCtor;
  });

  test('getRoles returns list', async () => {
    const chain = {
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(['r'])
    };
    mockFind.mockReturnValue(chain);
    const res = await getRoles({ page: 1, limit: 10 });
    expect(res).toEqual(['r']);
  });

  test('getRoleById and getRoleByName', async () => {
    mockFindOne.mockResolvedValueOnce({ roleId: 'r1' });
    const a = await getRoleById('r1');
    expect(a.roleId).toBe('r1');
    mockFindOne.mockResolvedValueOnce({ name: 'N1' });
    const b = await getRoleByName('N1');
    expect(b.name).toBe('N1');
  });

  test('createRole returns error when exists and creates when not', async () => {
    mockFindOne.mockResolvedValueOnce({ name: 'n' });
    const r1 = await createRole({ name: 'n' });
    expect(r1[0]).toBeInstanceOf(Error);

    mockFindOne.mockResolvedValueOnce(null);
    models.Role = function (body) {
      return { save: jest.fn().mockResolvedValue({ ...body, roleId: 'r1' }) };
    };
    // keep the static findOne mock available when we reassign Role in tests
    models.Role.findOne = mockFindOne;
    const r2 = await createRole({ name: 'n2', description: 'd' });
    expect(r2[0]).toBeNull();
    expect(r2[1].roleId).toBe('r1');
  });

  test('updateRole returns updated tuple', async () => {
    mockFindOneAndUpdate.mockResolvedValue({ name: 'up' });
    const r = await updateRole('r1', { name: 'up' });
    expect(r).toEqual([null, { name: 'up' }]);
  });

  test('deleteRole returns error when none deleted and success when deleted', async () => {
    mockDeleteOne.mockResolvedValueOnce({ deletedCount: 0 });
    const r1 = await deleteRole('r1');
    expect(r1[0]).toBeInstanceOf(Error);

    mockDeleteOne.mockResolvedValueOnce({ deletedCount: 1 });
    const r2 = await deleteRole('r1');
    expect(r2).toEqual([null, { deletedCount: 1 }]);
  });
});
