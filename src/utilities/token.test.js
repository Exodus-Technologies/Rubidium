import {
  generateAuthJWTToken,
  generateOTPCode,
  generateTransactionId,
  verifyJWTToken
} from './token';

describe('token utilities', () => {
  test('generators produce expected length strings', () => {
    const tx = generateTransactionId();
    expect(tx.length).toBe(12);
    const otp = generateOTPCode();
    expect(otp.length).toBe(6);
  });

  test('JWT generation and verification roundtrip', () => {
    const user = { isAdmin: false, email: 'a@b.com', userId: 'u1' };
    const token = generateAuthJWTToken(user);
    expect(typeof token).toBe('string');
    const decoded = verifyJWTToken(token);
    expect(decoded.data.userId).toBe('u1');
  });
});
