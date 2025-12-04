import models from '../models';
import {
  createOTPCode,
  deleteCode,
  getCodeByUserId,
  verifyOTPCode
} from './code';

jest.mock('../models');

describe('code queries', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getCodeByUserId returns tuple when found', async () => {
    const MockCtor = function () {};
    MockCtor.findOne = jest
      .fn()
      .mockResolvedValue({ userId: 'u1', otpCode: '1111' });
    models.Code = MockCtor;
    const r = await getCodeByUserId('u1');
    expect(r[0]).toBeNull();
    expect(r[1].userId).toBe('u1');
  });

  test('createOTPCode creates when none exists and rejects when exists', async () => {
    const mockFindOne = jest.fn();
    mockFindOne.mockResolvedValueOnce(null);
    const MockCtor = function (body) {
      return { save: jest.fn().mockResolvedValue(body) };
    };
    MockCtor.findOne = mockFindOne;
    models.Code = MockCtor;
    const created = await createOTPCode({ userId: 'u1', otpCode: '2222' });
    expect(created[0]).toBeNull();

    mockFindOne.mockResolvedValueOnce({ userId: 'u1' });
    models.Code = MockCtor;
    const dup = await createOTPCode({ userId: 'u1', otpCode: '3333' });
    expect(dup[0]).toBeInstanceOf(Error);
  });

  test('deleteCode returns correct tuple', async () => {
    const mockDelete = jest.fn().mockResolvedValue({ deletedCount: 1 });
    const MockCtor = function () {};
    MockCtor.deleteOne = mockDelete;
    models.Code = MockCtor;
    const r = await deleteCode('u1');
    expect(r).toEqual([null, { deletedCount: 1 }]);
  });

  test('verifyOTPCode success and failure', async () => {
    const MockCtor = function () {};
    MockCtor.findOne = jest
      .fn()
      .mockResolvedValue({ email: 'a@b', otpCode: '9999' });
    models.Code = MockCtor;
    const ok = await verifyOTPCode('a@b', '9999');
    expect(ok[0]).toBeNull();
    const bad = await verifyOTPCode('a@b', '0000');
    expect(bad[0]).toBeInstanceOf(Error);
  });
});
