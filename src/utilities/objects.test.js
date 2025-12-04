import { isEmpty } from './objects';

describe('objects utilities', () => {
  test('isEmpty returns true for empty object and false for non-empty', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});
