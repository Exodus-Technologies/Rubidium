import {
  createCurrentMoment,
  createFormattedDate,
  fancyTimeFormat,
  getSubscriptionStartDate
} from './time';

describe('time utilities', () => {
  test('fancyTimeFormat formats seconds correctly', () => {
    expect(fancyTimeFormat(65)).toBe('1:05');
    expect(fancyTimeFormat(3661)).toBe('1:01:01');
  });

  test('createCurrentMoment and formatted dates return values', () => {
    const m = createCurrentMoment();
    expect(typeof m.format).toBe('function');
    const f = createFormattedDate();
    expect(typeof f).toBe('string');
    const s = getSubscriptionStartDate();
    expect(typeof s).toBe('string');
  });
});
