import { generateOTPCodeHtml, generatePasswordResetHtml } from './templates';

describe('templates utilities', () => {
  test('generateOTPCodeHtml includes otp and link when admin', () => {
    const user = { fullName: 'A B', email: 'a@b.com', isAdmin: true };
    const html = generateOTPCodeHtml(user, '1234');
    expect(typeof html).toBe('string');
    expect(html).toContain('1234');
    expect(html).toContain('verifyOTP');
  });

  test('generatePasswordResetHtml returns string and contains Login for admin', () => {
    const admin = { fullName: 'Admin', isAdmin: true };
    const html = generatePasswordResetHtml(admin);
    expect(typeof html).toBe('string');
    expect(html).toContain('Login');
  });
});
