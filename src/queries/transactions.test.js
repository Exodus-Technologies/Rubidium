import models from '../models';
import { saveTransaction } from './transactions';
jest.mock('../models');

describe('transactions queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('saveTransaction calls save on model', async () => {
    const save = jest.fn().mockResolvedValue({ txId: 't1' });
    const MockCtor = function (body) {
      return { save };
    };
    models.Transaction = MockCtor;
    const [err, res] = await saveTransaction({ amount: 10 });
    expect(err).toBeNull();
    expect(res.txId).toBe('t1');
    expect(save).toHaveBeenCalled();
  });
});

jest.mock('../models');

describe('transactions queries', () => {
  test('saveTransaction calls save on Transaction constructor', async () => {
    const mockSave = jest.fn().mockResolvedValue(true);
    const MockCtor = function (body) {
      return { save: mockSave };
    };
    models.Transaction = MockCtor;

    await saveTransaction({ amount: 10 });
    expect(mockSave).toHaveBeenCalled();
  });
});
