import models from '../models';
import {
  createPermission,
  deletePermissionById,
  getPermissionById,
  getPermissionByName,
  getPermissions,
  updatePermission
} from './permissions';

jest.mock('../models');

describe('permissions queries', () => {
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
      return {
        save: jest.fn().mockResolvedValue({ ...body, permissionId: 'p1' })
      };
    };
    MockCtor.find = mockFind;
    MockCtor.findOne = mockFindOne;
    MockCtor.findOneAndUpdate = mockFindOneAndUpdate;
    MockCtor.deleteOne = mockDeleteOne;
    models.Permission = MockCtor;
  });

  test('getPermissions returns list', async () => {
    const chain = {
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(['x'])
    };
    mockFind.mockReturnValue(chain);
    const res = await getPermissions({ page: 1, limit: 10 });
    expect(res).toEqual(['x']);
  });

  test('getPermissionById and getPermissionByName', async () => {
    mockFindOne.mockResolvedValueOnce({ permissionId: 'p1' });
    const a = await getPermissionById('p1');
    expect(a.permissionId).toBe('p1');
    mockFindOne.mockResolvedValueOnce({ name: 'N1' });
    const b = await getPermissionByName('N1');
    expect(b.name).toBe('N1');
  });

  test('createPermission returns error when exists and creates when not', async () => {
    mockFindOne.mockResolvedValueOnce({ name: 'n' });
    const r1 = await createPermission({ name: 'n' });
    expect(r1[0]).toBeInstanceOf(Error);

    mockFindOne.mockResolvedValueOnce(null);
    models.Permission = function (body) {
      return {
        save: jest.fn().mockResolvedValue({ ...body, permissionId: 'p1' })
      };
    };
    // keep static findOne available when reassigning Permission in tests
    models.Permission.findOne = mockFindOne;
    const r2 = await createPermission({ name: 'n2', description: 'd' });
    expect(r2[0]).toBeNull();
    expect(r2[1].permissionId).toBe('p1');
  });

  test('updatePermission returns updated tuple', async () => {
    mockFindOneAndUpdate.mockResolvedValue({ name: 'up' });
    const r = await updatePermission('p1', { name: 'up' });
    expect(r).toEqual([null, { name: 'up' }]);
  });

  test('deletePermissionById returns error when none deleted and success when deleted', async () => {
    mockDeleteOne.mockResolvedValueOnce({ deletedCount: 0 });
    const r1 = await deletePermissionById('p1');
    expect(r1[0]).toBeInstanceOf(Error);

    mockDeleteOne.mockResolvedValueOnce({ deletedCount: 1 });
    const r2 = await deletePermissionById('p1');
    expect(r2).toEqual([null, { deletedCount: 1 }]);
  });
});
